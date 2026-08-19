import type { ShopListItem } from "../types";

// Placeholder data - GET /api/shops has no "open now" filter, and
// Shop.OpeningHours is free-text (not structured), so there is no reliable
// way to compute this client-side yet. Replace once the backend exposes
// either an isOpenNow flag or structured opening-hours data.
export const mockOpenNowShops: ShopListItem[] = [
  {
    id: -1,
    ownerId: 0,
    name: "Kaneo Pottery Studio",
    description: "Hand-thrown ceramics inspired by Lake Ohrid.",
    latitude: 41.1076,
    longitude: 20.7902,
    address: "Kaneo, Ohrid",
    regionId: 3,
    regionName: "Plaošnik / Kaneo",
    categoryId: 1,
    categoryName: "Pottery",
    imageUrl: "",
    isVerified: true,
    openingHours: "09:00 - 18:00",
  },
  {
    id: -2,
    ownerId: 0,
    name: "Bazaar Silverworks",
    description: "Filigree jewelry crafted using traditional techniques.",
    latitude: 41.1149,
    longitude: 20.8007,
    address: "Old Bazaar, Ohrid",
    regionId: 2,
    regionName: "Old Bazaar (Čaršija)",
    categoryId: 2,
    categoryName: "Jewelry",
    imageUrl: "",
    isVerified: false,
    openingHours: "10:00 - 19:00",
  },
];
