import { createClient } from "@sanity/client";

// Pushes upcoming Sanity events into Discord as native Guild Scheduled
// Events, so members can see them and RSVP directly in Discord. Triggered on
// a schedule (see /api/cron/discord-sync) rather than a Sanity webhook —
// Sanity's free plan caps webhooks at two and both are already in use (see
// eventSync.ts), so this polls instead of reacting to publishes.
//
// Each Sanity event that gets a Discord event stores the Discord event's ID
// back on itself (discordEventId) so future runs update the same Discord
// event instead of creating duplicates. If the Discord event was deleted out
// from under us (e.g. manually in Discord), the stored ID no longer appears
// in the guild's scheduled-event list and a fresh one is created.

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const DISCORD_API = "https://discord.com/api/v10";

// Discord in-person ("external") events must carry an explicit end time.
// Event nights aren't modelled with a duration in Sanity, so a fixed length
// is assumed; long enough to cover a typical pauper league night.
const DEFAULT_EVENT_DURATION_HOURS = 4;

const GUILD_SCHEDULED_EVENT_STATUS_CANCELED = 4;
const GUILD_SCHEDULED_EVENT_ENTITY_TYPE_EXTERNAL = 3;
const GUILD_SCHEDULED_EVENT_PRIVACY_LEVEL_GUILD_ONLY = 2;

interface SanityEvent {
  _id: string;
  title: string;
  eventDate: string;
  location: string;
  description?: string | null;
  slug?: { current: string } | null;
  isCancelled?: boolean | null;
  discordEventId?: string | null;
}

interface DiscordScheduledEvent {
  id: string;
  status: number;
}

const MAX_RATE_LIMIT_RETRIES = 5;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Guild scheduled event creation carries a much stricter, undocumented rate
// limit than the general Discord API, so syncing several events in one run
// reliably hits 429s. Discord's response tells us exactly how long to wait
// (retry_after, in seconds), so back off and retry rather than failing.
async function discordRequest(path: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt++) {
    const res = await fetch(`${DISCORD_API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (res.status !== 429 || attempt === MAX_RATE_LIMIT_RETRIES) return res;

    const body = await res.clone().json().catch(() => null);
    const retryAfterSeconds = typeof body?.retry_after === "number" ? body.retry_after : 1;
    await sleep(retryAfterSeconds * 1000);
  }
  throw new Error("unreachable");
}

function eventUrl(slug: string | undefined) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://brightonpauperleague.com";
  return slug ? `${site}/events/${slug}` : site;
}

function buildDescription(event: SanityEvent): string {
  const parts = [event.description?.trim(), eventUrl(event.slug?.current)].filter(Boolean);
  return parts.join("\n\n").slice(0, 1000);
}

function toDiscordPayload(event: SanityEvent) {
  const start = new Date(event.eventDate);
  const end = new Date(start.getTime() + DEFAULT_EVENT_DURATION_HOURS * 60 * 60 * 1000);

  return {
    name: event.title.slice(0, 100),
    description: buildDescription(event),
    scheduled_start_time: start.toISOString(),
    scheduled_end_time: end.toISOString(),
    entity_type: GUILD_SCHEDULED_EVENT_ENTITY_TYPE_EXTERNAL,
    privacy_level: GUILD_SCHEDULED_EVENT_PRIVACY_LEVEL_GUILD_ONLY,
    entity_metadata: { location: event.location.slice(0, 100) },
  };
}

async function setDiscordEventId(sanityEventId: string, discordEventId: string | null) {
  await writeClient.patch(sanityEventId).set({ discordEventId }).commit();
}

export interface DiscordSyncSummary {
  created: number;
  updated: number;
  cancelled: number;
  errors: { eventId: string; message: string }[];
}

/** Syncs every non-past Sanity event into the configured Discord guild's scheduled events. */
export async function syncEventsToDiscord(): Promise<DiscordSyncSummary> {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId || !process.env.DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN and DISCORD_GUILD_ID must be set");
  }

  const summary: DiscordSyncSummary = { created: 0, updated: 0, cancelled: 0, errors: [] };

  const existingRes = await discordRequest(`/guilds/${guildId}/scheduled-events`);
  if (!existingRes.ok) {
    throw new Error(`Failed to list Discord scheduled events: ${existingRes.status} ${await existingRes.text()}`);
  }
  const existingEvents: DiscordScheduledEvent[] = await existingRes.json();
  const existingById = new Map(existingEvents.map((e) => [e.id, e]));

  const today = new Date().toISOString().slice(0, 10);
  const events: SanityEvent[] = await writeClient.fetch(
    `*[_type == "event" && dateTime(eventDate) >= dateTime($today + "T00:00:00Z")]{
      _id, title, eventDate, location, description, slug, isCancelled, discordEventId
    }`,
    { today },
  );

  for (const event of events) {
    try {
      const linked = event.discordEventId ? existingById.get(event.discordEventId) : undefined;

      if (event.isCancelled) {
        if (linked && linked.status !== GUILD_SCHEDULED_EVENT_STATUS_CANCELED) {
          const res = await discordRequest(`/guilds/${guildId}/scheduled-events/${linked.id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: GUILD_SCHEDULED_EVENT_STATUS_CANCELED }),
          });
          if (!res.ok) throw new Error(`Discord cancel failed: ${res.status} ${await res.text()}`);
          summary.cancelled += 1;
        }
        continue;
      }

      const payload = toDiscordPayload(event);

      if (linked) {
        const res = await discordRequest(`/guilds/${guildId}/scheduled-events/${linked.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Discord update failed: ${res.status} ${await res.text()}`);
        summary.updated += 1;
        continue;
      }

      // Either never synced, or the stored ID no longer matches a live
      // Discord event (e.g. it was deleted manually) — create a fresh one.
      const res = await discordRequest(`/guilds/${guildId}/scheduled-events`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Discord create failed: ${res.status} ${await res.text()}`);
      const created: DiscordScheduledEvent = await res.json();
      await setDiscordEventId(event._id, created.id);
      summary.created += 1;
    } catch (err) {
      summary.errors.push({ eventId: event._id, message: err instanceof Error ? err.message : String(err) });
    }
  }

  return summary;
}
