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

function extractImageUri(card: ScryfallCard): string | null {
  if (card.image_uris?.normal) return card.image_uris.normal;
  return card.card_faces?.[0]?.image_uris?.normal ?? null;
}

// Batch-resolves card names to image URIs via POST /cards/collection.
// Handles batches of up to 75, indexes by canonical name and front-face name
// (for double-faced cards) so lookups succeed regardless of which form was stored.
export async function resolveCardImages(
  names: string[]
): Promise<Record<string, string>> {
  if (names.length === 0) return {};

  const result: Record<string, string> = {};
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
          body: JSON.stringify({ identifiers: batch.map((name) => ({ name })) }),
        });
        if (!res.ok) return;
        const json: ScryfallCollectionResponse = await res.json();
        for (const card of json.data) {
          const uri = extractImageUri(card);
          if (!uri) continue;
          result[card.name] = uri;
          const front = card.name.split(" // ")[0].trim();
          if (front !== card.name) result[front] = uri;
        }
      } catch {
        // Silently skip failed batches; affected cards will show placeholders
      }
    })
  );

  return result;
}
