// Lets us import a markdown file as a raw string (Vite `?raw` suffix), so the
// admin guide has a single canonical .md source that is also rendered in-Studio.
declare module '*.md?raw' {
  const content: string
  export default content
}
