// Matches youtu.be/<id>, youtube.com/watch?v=<id>, and youtube.com/embed/<id>.
export function getYoutubeVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}
