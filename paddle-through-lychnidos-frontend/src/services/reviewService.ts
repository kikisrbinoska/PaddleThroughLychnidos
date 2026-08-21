import apiClient from "./apiClient";
import type {
  ReviewAddResponse,
  ReviewEditResponse,
  ReviewListResponse,
} from "../types/review";

export interface ReviewListParams {
  shopId?: number;
  userId?: number;
  pageNumber?: number;
  pageSize?: number;
}

// Write endpoints don't take userId - apiClient's interceptor attaches the
// bearer token, and the API derives the current user from it (see
// ReviewsController.GetCurrentUserId).
export const reviewService = {
  getAll: (params: ReviewListParams = {}) =>
    apiClient
      .get<ReviewListResponse>("/reviews", { params })
      .then((res) => res.data),
  getByShopId: (shopId: number, params: { pageNumber?: number; pageSize?: number } = {}) =>
    apiClient
      .get<ReviewListResponse>(`/shops/${shopId}/reviews`, { params })
      .then((res) => res.data),
  create: (shopId: number, rating: number, comment: string) =>
    apiClient
      .post<ReviewAddResponse>("/reviews", { shopId, rating, comment })
      .then((res) => res.data),
  update: (id: number, rating: number, comment: string) =>
    apiClient
      .put<ReviewEditResponse>(`/reviews/${id}`, { rating, comment })
      .then((res) => res.data),
  remove: (id: number) =>
    apiClient.delete(`/reviews/${id}`).then((res) => res.data),
};
