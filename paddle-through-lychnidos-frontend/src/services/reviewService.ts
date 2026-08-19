import apiClient from "./apiClient";
import type { Review } from "../types";

export const reviewService = {
  getByShopId: (shopId: number) =>
    apiClient
      .get<Review[]>("/reviews", { params: { shopId } })
      .then((res) => res.data),
  create: (shopId: number, rating: number, comment: string) =>
    apiClient
      .post<Review>("/reviews", { shopId, rating, comment })
      .then((res) => res.data),
};
