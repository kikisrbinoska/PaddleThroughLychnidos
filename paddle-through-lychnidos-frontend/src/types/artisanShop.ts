// Mirrors PaddleThroughLychnidos.Domain.Entities.ShopStatus.
export type ShopStatusName = "Pending" | "Approved" | "Rejected";

// Mirrors PaddleThroughLychnidos.Domain.Entities.MembershipTier. The API
// returns this as a string (Shop.MembershipTier.ToString() in
// OwnedShopDto), but expects the raw int back in request bodies (no
// JsonStringEnumConverter is registered - see types/user.ts's UserRole for
// the same pattern).
export type MembershipTierName = "Free" | "Premium";

export const MembershipTier = {
  Free: 0,
  Premium: 1,
} as const;

export type MembershipTier = (typeof MembershipTier)[keyof typeof MembershipTier];

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.OwnedShopDto,
// returned inside GetByOwnerIdResponse.shops (GET /api/artisan/shops) and
// directly by GET /api/artisan/shops/{id}.
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
  membershipTier: MembershipTierName;
  membershipActivatedAt: string | null;
}

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.GetByOwnerIdResponse.
// An artisan may own more than one shop - empty when they have none yet.
export interface MyShopsResponse {
  shops: OwnedShop[];
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

// Mirrors PaddleThroughLychnidos.Application.Shop.Commands.SelectMembershipResponse.
export interface SelectMembershipResponse {
  shopId: number;
  membershipTier: MembershipTierName;
  membershipActivatedAt: string | null;
  message: string;
}
