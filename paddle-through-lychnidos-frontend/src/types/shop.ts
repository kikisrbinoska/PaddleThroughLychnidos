import type { ShopImage } from "./shopImage";
import type { Product } from "./product";
import type { Review } from "./review";

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.ShopListItem, as
// returned inside GetPagedResponse.items by GET /api/shops. This is a
// narrower projection than the full Shop entity - use ShopDetail (below)
// for GET /api/shops/{id}.
export interface ShopListItem {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  regionId: number;
  regionName: string;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  isVerified: boolean;
  openingHours: string;
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
  ownerId: number;
  ownerName: string;
  name: string;
  description: string;
  story: string;
  latitude: number;
  longitude: number;
  address: string;
  regionId: number;
  regionName: string;
  categoryId: number;
  categoryName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  isVerified: boolean;
  openingHours: string;
}

// Mirrors PaddleThroughLychnidos.Domain.Entities.Shop. Not returned in full
// by any current endpoint (GetByIdResponse omits images/products/reviews) -
// kept for future use once those are added to the API.
export interface Shop {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  story: string;
  latitude: number;
  longitude: number;
  address: string;
  regionId: number;
  categoryId: number;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  isVerified: boolean;
  openingHours: string;
  images: ShopImage[];
  products: Product[];
  reviews: Review[];
}
