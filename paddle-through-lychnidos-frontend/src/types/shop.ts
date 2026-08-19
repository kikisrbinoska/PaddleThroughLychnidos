import type { ShopImage } from "./shopImage";
import type { Product } from "./product";
import type { Review } from "./review";

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.ShopListItem, as
// returned inside GetPagedResponse.items by GET /api/shops. This is a
// narrower projection than the full Shop entity - use ShopDetail (below)
// for GET /api/shops/{id}.
export interface ShopListItem {
  id: number;
  // Nullable: the ~80 shops imported from Google Places have no owner or
  // region assigned yet (RegionId is set via a separate point-in-polygon
  // step, OwnerId once real artisan accounts are linked).
  ownerId: number | null;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  regionId: number | null;
  regionName: string;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  // Google Places rating (1-5) and review count. Null for shops with no
  // Google rating data - render nothing (not a 0-star / "0 reviews" state).
  rating: number | null;
  userRatingCount: number | null;
  isVerified: boolean;
  openingHours: string;
  // Null when the shop has no structured hours data yet (true for all
  // shops imported from Google Places so far) - "unknown", not "closed".
  isOpenNow: boolean | null;
}

export interface ShopListMetadata {
  totalCount: number;
  pageSize: number | null;
  pageNumber: number | null;
  totalPages: number;
}

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.GetPagedResponse.
export interface ShopListResponse {
  items: ShopListItem[];
  metadata: ShopListMetadata;
}

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.GetByIdResponse,
// returned by GET /api/shops/{id}.
export interface ShopDetail {
  id: number;
  ownerId: number | null;
  ownerName: string;
  name: string;
  description: string;
  story: string;
  latitude: number;
  longitude: number;
  address: string;
  regionId: number | null;
  regionName: string;
  categoryId: number;
  categoryName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  // Populated for shops imported from Google Places; null otherwise.
  website: string | null;
  rating: number | null;
  userRatingCount: number | null;
  isVerified: boolean;
  openingHours: string;
  isOpenNow: boolean | null;
}

// Mirrors PaddleThroughLychnidos.Domain.Entities.Shop. Not returned in full
// by any current endpoint (GetByIdResponse omits images/products/reviews) -
// kept for future use once those are added to the API. Updated to match the
// entity's current nullability (ownerId/regionId) and new fields
// (website/rating/userRatingCount), same as ShopDetail above - flagging
// per audit: still unused by any endpoint, not reduced, just kept in sync.
export interface Shop {
  id: number;
  ownerId: number | null;
  name: string;
  description: string;
  story: string;
  latitude: number;
  longitude: number;
  address: string;
  regionId: number | null;
  categoryId: number;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  website: string | null;
  rating: number | null;
  userRatingCount: number | null;
  isVerified: boolean;
  openingHours: string;
  isOpenNow: boolean | null;
  images: ShopImage[];
  products: Product[];
  reviews: Review[];
}
