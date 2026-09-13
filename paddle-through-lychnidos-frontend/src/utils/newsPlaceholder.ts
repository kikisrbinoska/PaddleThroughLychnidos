// Vintage paper texture placeholders live in public/news-placeholders/ and
// are added by hand (not bulk-imported) - referenced here by expected path
// rather than a static `import`, so a missing file 404s the <img> at
// runtime instead of failing the whole Vite build (same convention as
// categoryStyle.ts's category-backgrounds). Files under public/ are served
// as-is at the same path in both dev and the production build.
const VINTAGE_PLACEHOLDER_PATHS = [
  "/news-placeholders/vintage-1.jpg",
  "/news-placeholders/vintage-2.jpg",
  "/news-placeholders/vintage-3.jpg",
  "/news-placeholders/vintage-4.jpg",
];

// Deterministic pick based on the news item's id, so the same item always
// shows the same vintage placeholder instead of re-randomizing on every
// render.
export function getNewsPlaceholder(newsId: number): string {
  const index = newsId % VINTAGE_PLACEHOLDER_PATHS.length;
  return VINTAGE_PLACEHOLDER_PATHS[index];
}
