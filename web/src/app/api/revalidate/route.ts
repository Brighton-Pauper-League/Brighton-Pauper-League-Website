import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";
import { syncEventOnPublish } from "@/lib/eventSync";

// On-demand revalidation endpoint for Sanity webhooks.
//
// Configure a webhook in Sanity (sanity.io/manage → API → Webhooks) pointing at
// `<site>/api/revalidate`, with the same secret as SANITY_REVALIDATE_SECRET.
// Any document change refreshes the whole route tree — appropriate for a small
// site, and avoids per-type tag bookkeeping. (Live preview/editing already uses
// the Sanity Live Content API via `SanityLive`; this covers cached production
// pages built with the plain client.)
//
// Also doubles as the event-publish hook (slug generation + standings sync,
// see eventSync.ts) — Sanity's free plan caps webhooks at two, and both are
// already spoken for (this one, and the loaner-deck card-image hook), so
// there's no free slot for a dedicated event webhook.
type WebhookPayload = { _type?: string; _id?: string };

export async function POST(req: NextRequest) {
  try {
    // Skip parseBody's default 3-second "eventual consistency" sleep: Sanity
    // delivers webhook messages sequentially per hook, so a slow response
    // throttles the whole delivery queue (a backlog drains at one message per
    // response time). Nothing here needs the wait — revalidatePath doesn't
    // read the dataset, and eventSync re-fetches the document itself.
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      false,
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    if (body?._type === "event" && body._id && !body._id.startsWith("drafts.")) {
      await syncEventOnPublish(body._id);
    }

    // Revalidate everything under the root layout.
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}
