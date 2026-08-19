import apiClient from "./apiClient";
import type { Review } from "../types";

export const reviewService = {
  getByShopId: (shopId: number) =>
    apiClient
      .get<Review[]>(`/shops/${shopId}/reviews`)
      .then((res) => res.data),
  create: (shopId: number, rating: number, comment: string) =>
    apiClient
      .post<Review>(`/shops/${shopId}/reviews`, { rating, comment })
      .then((res) => res.data),
};
