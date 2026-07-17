// Renders a JSON-LD structured-data block. The `<` replacement follows Next's
// JSON-LD guidance: JSON.stringify does not escape HTML, so scrubbing `<` to its
// unicode form closes off script-injection through any string in the payload.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
