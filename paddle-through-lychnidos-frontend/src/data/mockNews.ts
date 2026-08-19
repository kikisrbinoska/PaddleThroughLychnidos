// Placeholder data - the Magazine feature has no backend endpoint yet.
// Replace with a real magazineService fetch once one exists.
export interface NewsPreview {
  id: number;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
}

export const mockNews: NewsPreview[] = [
  {
    id: 1,
    title: "The Woodcarvers of Old Ohrid",
    excerpt: "How a centuries-old craft survives in the Bazaar's back alleys.",
    thumbnailUrl: "",
  },
  {
    id: 2,
    title: "A Guide to Ohrid Pearls",
    excerpt: "The legendary technique behind Lake Ohrid's iconic pearls.",
    thumbnailUrl: "",
  },
  {
    id: 3,
    title: "Feasting at St. Naum",
    excerpt: "Traditional lake-trout recipes passed down for generations.",
    thumbnailUrl: "",
  },
  {
    id: 4,
    title: "Weaving Varosh's Story",
    excerpt: "Textile patterns that trace the history of the Old Town.",
    thumbnailUrl: "",
  },
];
