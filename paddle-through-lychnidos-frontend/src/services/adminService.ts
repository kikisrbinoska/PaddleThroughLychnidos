import apiClient from "./apiClient";
import type {
  AdminDashboardStats,
  AdminPendingShopsResponse,
  AdminVerificationRequestsResponse,
  VerificationRequestStatus,
} from "../types";

// All endpoints require auth as an Administrator - apiClient's interceptor
// attaches the bearer token. See AdminDashboardController, AdminShopsController,
// AdminVerificationController.
export const adminService = {
  getDashboardStats: () =>
    apiClient
      .get<AdminDashboardStats>("/admin/dashboard-stats")
      .then((res) => res.data),

  getPendingShops: () =>
    apiClient
      .get<AdminPendingShopsResponse>("/admin/shops/pending")
      .then((res) => res.data),

  approveShop: (shopId: number) =>
    apiClient
      .post<{ id: number; status: string; message: string }>(`/admin/shops/${shopId}/approve`)
      .then((res) => res.data),

  rejectShop: (shopId: number, reason: string) =>
    apiClient
      .post<{ id: number; status: string; rejectionReason: string; message: string }>(
        `/admin/shops/${shopId}/reject`,
        { reason },
      )
      .then((res) => res.data),

  getVerificationRequests: (status: VerificationRequestStatus = "Pending") =>
    apiClient
      .get<AdminVerificationRequestsResponse>("/admin/verification/pending", {
        params: { status },
      })
      .then((res) => res.data),

  approveVerification: (requestId: number) =>
    apiClient
      .post<{ id: number; shopId: number; status: string; message: string }>(
        `/admin/verification/${requestId}/approve`,
      )
      .then((res) => res.data),

  rejectVerification: (requestId: number, reason: string) =>
    apiClient
      .post<{ id: number; shopId: number; status: string; message: string }>(
        `/admin/verification/${requestId}/reject`,
        { reason },
      )
      .then((res) => res.data),
};
