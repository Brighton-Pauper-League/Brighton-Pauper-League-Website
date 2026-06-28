// Bare Scryfall API utilities — no caching. Used by the deck-published webhook
// route, which runs once per publish and writes results back to Sanity.

const SCRYFALL_HEADERS = {
  "User-Agent": "BrightonPauperLeague/1.0 (brightonpauperleague.com)",
  Accept: "application/json",
};

interface ScryfallCardFace {
  image_uris?: { normal?: string };
}

interface ScryfallCard {
  name: string;
  image_uris?: { normal?: string };
  card_faces?: ScryfallCardFace[];
}

interface ScryfallCollectionResponse {
  data: ScryfallCard[];
}

export interface CardImageResult {
  front: string;
  back?: string;
}

function extractFaces(card: ScryfallCard): CardImageResult | null {
  // Single-faced card
  if (card.image_uris?.normal) {
    return { front: card.image_uris.normal };
  }
  // Double-faced card
  const front = card.card_faces?.[0]?.image_uris?.normal;
  const back = card.card_faces?.[1]?.image_uris?.normal;
  if (front) {
    return { front, ...(back ? { back } : {}) };
  }
  return null;
}

// Batch-resolves card names to image URIs via POST /cards/collection.
// Sends only the front-face name for DFCs (everything before " // ") since that
// is what Scryfall's collection endpoint expects. Results are indexed by both
// the canonical full name and the front-face name so lookups succeed regardless
// of which form is stored in Sanity.
export async function resolveCardImages(
  names: string[]
): Promise<Record<string, CardImageResult>> {
  if (names.length === 0) return {};

  const result: Record<string, CardImageResult> = {};
  const batches: string[][] = [];
  for (let i = 0; i < names.length; i += 75) {
    batches.push(names.slice(i, i + 75));
  }

  await Promise.all(
    batches.map(async (batch) => {
      try {
        const res = await fetch("https://api.scryfall.com/cards/collection", {
          method: "POST",
          headers: { ...SCRYFALL_HEADERS, "Content-Type": "application/json" },
          body: JSON.stringify({
            identifiers: batch.map((name) => ({
              name: name.split(" // ")[0].trim(),
            })),
          }),
        });
        if (!res.ok) return;
        const json: ScryfallCollectionResponse = await res.json();
        for (const card of json.data) {
          const faces = extractFaces(card);
          if (!faces) continue;
          result[card.name] = faces;
          const front = card.name.split(" // ")[0].trim();
          if (front !== card.name) result[front] = faces;
        }
      } catch {
        // Silently skip failed batches; affected cards will show placeholders
      }
    })
  );

  return result;
}
