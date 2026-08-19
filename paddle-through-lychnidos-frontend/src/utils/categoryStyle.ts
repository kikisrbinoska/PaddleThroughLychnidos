// Category background images live in src/assets/category-backgrounds/ and
// are added by hand (not bulk-imported) - referenced here by expected path
// rather than a static `import`, so a missing file 404s the <img> at
// runtime (caught by CategoryImage's onError, see CategoryImage.tsx)
// instead of failing the whole Vite build.
const CATEGORY_BACKGROUND_PATHS: Record<string, string> = {
  Jewelry: "/src/assets/category-backgrounds/jewelry-category.jpg",
  TraditionalCostume: "/src/assets/category-backgrounds/costume-category.jpg",
  WoodCarving: "/src/assets/category-backgrounds/woodcarving-category.jpg",
  HandmadePaper: "/src/assets/category-backgrounds/paper-category.jpg",
  Iconography: "/src/assets/category-backgrounds/iconography-category.jpg",
  ArtGallery: "/src/assets/category-backgrounds/artgallery-category.jpg",
  CraftWorkshopGeneral: "/src/assets/category-backgrounds/craft-category.jpg",
  SouvenirShop: "/src/assets/category-backgrounds/souvenir-category.jpg",
};

export function getCategoryBackgroundPath(categoryName: string): string | null {
  return CATEGORY_BACKGROUND_PATHS[categoryName] ?? null;
}

interface ShopForImage {
  imageUrl?: string | null;
  categoryName: string;
}

// Real shop image if present, else the category's fallback path (or null
// if the category has no mapped fallback either - callers render the
// gradient-only placeholder in that case).
export function getShopImage(shop: ShopForImage): string | null {
  if (shop.imageUrl) return shop.imageUrl;
  return getCategoryBackgroundPath(shop.categoryName);
}

// Accent color classes per category, used for badges and product-image
// gradient placeholders. Falls back to primary for unmapped categories.
interface CategoryAccent {
  badgeBg: string;
  badgeText: string;
  gradientFrom: string;
  gradientTo: string;
}

const CATEGORY_ACCENTS: Record<string, CategoryAccent> = {
  Jewelry: {
    badgeBg: "bg-nosija-gold-100",
    badgeText: "text-nosija-gold-900",
    gradientFrom: "from-nosija-gold-300",
    gradientTo: "to-nosija-gold-100",
  },
  TraditionalCostume: {
    badgeBg: "bg-nosija-red-100",
    badgeText: "text-nosija-red-900",
    gradientFrom: "from-nosija-red-300",
    gradientTo: "to-nosija-red-100",
  },
  WoodCarving: {
    badgeBg: "bg-brown-100",
    badgeText: "text-brown-900",
    gradientFrom: "from-brown-300",
    gradientTo: "to-brown-100",
  },
  HandmadePaper: {
    badgeBg: "bg-brown-100",
    badgeText: "text-brown-700",
    gradientFrom: "from-brown-100",
    gradientTo: "to-surface-card",
  },
  Iconography: {
    badgeBg: "bg-nosija-gold-100",
    badgeText: "text-nosija-gold-900",
    gradientFrom: "from-nosija-gold-300",
    gradientTo: "to-nosija-gold-100",
  },
  ArtGallery: {
    badgeBg: "bg-primary-100",
    badgeText: "text-primary-900",
    gradientFrom: "from-primary-300",
    gradientTo: "to-primary-100",
  },
  CraftWorkshopGeneral: {
    badgeBg: "bg-brown-100",
    badgeText: "text-brown-900",
    gradientFrom: "from-brown-300",
    gradientTo: "to-brown-100",
  },
  SouvenirShop: {
    badgeBg: "bg-secondary-100",
    badgeText: "text-secondary-900",
    gradientFrom: "from-secondary-300",
    gradientTo: "to-secondary-100",
  },
};

const DEFAULT_ACCENT: CategoryAccent = {
  badgeBg: "bg-primary-100",
  badgeText: "text-primary-900",
  gradientFrom: "from-primary-200",
  gradientTo: "to-primary-100",
};

export function getCategoryAccent(categoryName: string): CategoryAccent {
  return CATEGORY_ACCENTS[categoryName] ?? DEFAULT_ACCENT;
}
