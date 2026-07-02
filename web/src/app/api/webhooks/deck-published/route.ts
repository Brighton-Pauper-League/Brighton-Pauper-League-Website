import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { createHash } from "crypto";
import { resolveCardImages, type CardImageResult } from "@/lib/scryfall";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

interface SanityCard {
  _key: string;
  _type?: string;
  cardName: string;
  quantity: number;
  quantityOwned: number;
  isSideboard: boolean;
  imageUri?: string | null;
  imageUriBack?: string | null;
  typeLine?: string | null;
}

interface SanityDeck {
  _id: string;
  featuredCard?: string | null;
  featuredCardImageUri?: string | null;
  cards: SanityCard[];
  resolvedNamesHash?: string | null;
}

// Deterministic fingerprint of "what Scryfall was asked to resolve last time".
// Comparing this (rather than diffing the resolved content itself) sidesteps
// any flakiness in the resolved values — e.g. Scryfall/JSON transport quirks
// in non-ASCII type-line text — that previously made an unconditional commit
// look "changed" on every single run, re-triggering this same webhook forever.
function hashNames(names: string[]): string {
  return createHash("sha1").update([...names].sort().join("|")).digest("hex");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Read raw body first — isValidSignature needs the original string, not a parsed object.
  const rawBody = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature || !process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isValid = await isValidSignature(rawBody, signature, process.env.SANITY_WEBHOOK_SECRET);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { _id?: string; _type?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { _id, _type } = body;

  // Skip drafts and non-deck documents.
  if (_type !== "loanerDeck" || !_id || _id.startsWith("drafts.")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Re-fetch the full deck document, including the fingerprint of what was
  // resolved last time — needed below to skip re-processing entirely (and
  // avoid re-triggering this same webhook) when nothing that would change
  // the Scryfall lookup has actually changed.
  const deck: SanityDeck | null = await writeClient.fetch(
    `*[_id == $id][0]{ _id, featuredCard, featuredCardImageUri, resolvedNamesHash, cards[]{ _key, _type, cardName, quantity, quantityOwned, isSideboard, imageUri, imageUriBack, typeLine } }`,
    { id: _id }
  );

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  const cards: SanityCard[] = deck.cards ?? [];

  // Collect every unique card name — mainboard, sideboard, and featured card.
  const featuredCard = deck.featuredCard?.trim() || null;
  const fallbackCover =
    cards.find((c) => !c.isSideboard)?.cardName ?? null;
  const coverName = featuredCard ?? fallbackCover;

  const allNames = [...new Set([...cards.map((c) => c.cardName), ...(coverName ? [coverName] : [])])];
  const namesHash = hashNames(allNames);

  // Nothing that affects the Scryfall lookup has changed since last time —
  // skip entirely without calling Scryfall or committing anything.
  if (namesHash === deck.resolvedNamesHash) {
    return NextResponse.json({ ok: true, deckId: _id, unchanged: true });
  }

  const imageMap: Record<string, CardImageResult> = await resolveCardImages(allNames);

  // Build updated cards with front and back face URIs merged in.
  const updatedCards = cards.map((card) => {
    const faces = imageMap[card.cardName];
    return {
      ...card,
      imageUri: faces?.front ?? null,
      imageUriBack: faces?.back ?? null,
      typeLine: faces?.typeLine ?? null,
    };
  });

  const coverFaces = coverName ? imageMap[coverName] : null;
  const coverUri = coverFaces?.front ?? null;

  // Patch the document — replace cards array, set cover image URI, and
  // record the fingerprint so the next (self-triggered) invocation no-ops.
  let patch = writeClient.patch(_id).set({ cards: updatedCards, resolvedNamesHash: namesHash });
  if (coverUri) {
    patch = patch.set({ featuredCardImageUri: coverUri });
  } else {
    patch = patch.unset(["featuredCardImageUri"]);
  }

  await patch.commit();

  return NextResponse.json({
    ok: true,
    deckId: _id,
    cardsResolved: updatedCards.filter((c) => c.imageUri).length,
    cardsTotal: updatedCards.length,
  });
}
