import type { UserRole } from "./user";
import type { ShopStatusName } from "./artisanShop";

// Mirrors PaddleThroughLychnidos.Application.Admin.Queries.GetDashboardStatsResponse.
export interface AdminDashboardStats {
  totalShops: number;
  pendingShops: number;
  approvedShops: number;
  rejectedShops: number;
  verifiedArtisans: number;
  pendingVerificationRequests: number;
  totalUsers: number;
  regularUsers: number;
  artisans: number;
  administrators: number;
  totalReviews: number;
  totalItineraries: number;
}

// Mirrors PaddleThroughLychnidos.Application.Shop.Queries.PendingShopDto,
// returned inside GetPendingResponse.items by GET /api/admin/shops/pending.
export interface AdminPendingShop {
  id: number;
  name: string;
  description: string;
  ownerId: number | null;
  ownerName: string;
  ownerEmail: string;
  categoryName: string;
  regionName: string;
  createdAt: string;
}

export interface AdminPendingShopsResponse {
  items: AdminPendingShop[];
}

// Mirrors PaddleThroughLychnidos.Application.VerificationRequest.Queries.PendingVerificationDto.
export type VerificationRequestStatus = "Pending" | "Approved" | "Rejected";

export interface AdminVerificationRequest {
  id: number;
  shopId: number;
  shopName: string;
  ownerName: string;
  categoryName: string;
  submittedAt: string;
  notes: string;
  documentUrls: string[];
  status: VerificationRequestStatus;
  reviewedByAdminName: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface AdminVerificationRequestsResponse {
  items: AdminVerificationRequest[];
}

// Mirrors PaddleThroughLychnidos.Application.Category.Queries.GetForAdminResponse.
export interface AdminCategory {
  id: number;
  name: string;
  iconUrl: string;
  shopCount: number;
}

// Mirrors PaddleThroughLychnidos.Application.Region.Queries.GetForAdminResponse.
export interface AdminRegion {
  id: number;
  name: string;
  description: string;
  polygonGeoJson: string;
  shopCount: number;
  itineraryCount: number;
}

// Mirrors PaddleThroughLychnidos.Application.User.Queries.AdminUserListItem,
// returned inside GetAllResponse.items by GET /api/admin/users.
export interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  shopId: number | null;
  shopName: string | null;
  shopStatus: ShopStatusName | null;
}

export interface AdminUserListMetadata {
  totalCount: number;
  pageSize: number | null;
  pageNumber: number | null;
  totalPages: number;
}

// Mirrors PaddleThroughLychnidos.Application.User.Queries.GetAllResponse.
export interface AdminUserListResponse {
  items: AdminUser[];
  metadata: AdminUserListMetadata;
}
