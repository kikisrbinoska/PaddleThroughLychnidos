// Mirrors PaddleThroughLychnidos.Domain.Entities.ShopStatus.
export type ShopStatusName = "Pending" | "Approved" | "Rejected";

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.OwnedShopDto,
// returned inside GetByOwnerIdResponse.shop by GET /api/artisan/my-shop.
export interface OwnedShop {
  id: number;
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
  email: string;
  instagramHandle: string;
  website: string | null;
  rating: number | null;
  userRatingCount: number | null;
  isVerified: boolean;
  openingHours: string;
  status: ShopStatusName;
  rejectionReason: string | null;
  viewCount: number;
  savedCount: number;
  reviewCount: number;
  imageUrls: string[];
  hasPendingVerificationRequest: boolean;
}

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.GetByOwnerIdResponse.
export interface MyShopResponse {
  shop: OwnedShop | null;
}

export interface ShopFormFields {
  name: string;
  description: string;
  story: string;
  categoryId: number;
  regionId: number | null;
  phoneNumber: string;
  email: string;
  instagramHandle: string;
  website: string;
  openingHours: string;
}

// Mirrors PaddleThroughLychnidos.Application.Shop.Commands.AddResponse /
// EditResponse (the fields the create/edit forms actually use).
export interface ShopSaveResponse {
  id: number;
  status: string;
  message: string;
}

// Mirrors PaddleThroughLychnidos.Application.Shop.Commands.ResubmitResponse.
export interface ShopResubmitResponse {
  id: number;
  status: string;
  message: string;
}

// Mirrors PaddleThroughLychnidos.Application.ShopImage.Commands.AddResponse.
export interface ShopImageUploadResponse {
  id: number;
  shopId: number;
  url: string;
  message: string;
}
