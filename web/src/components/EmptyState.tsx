// Shared placeholder shown wherever a data list is empty, so "no content yet"
// looks intentional rather than broken. Used by event lists, standings, blog.
export function EmptyState({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="bg-white/60 border border-dashed border-[rgba(0,74,173,0.3)] rounded-2xl p-10 text-center">
      {title && (
        <p className="font-(family-name:--font-young-serif) text-2xl text-dark-brown mb-2">
          {title}
        </p>
      )}
      <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/60">
        {message}
      </p>
    </div>
  );
}
