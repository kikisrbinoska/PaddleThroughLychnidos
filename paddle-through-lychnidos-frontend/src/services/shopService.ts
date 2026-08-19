import apiClient from "./apiClient";
import type { ShopDetail, ShopListItem, ShopListResponse } from "../types";

export interface ShopListParams {
  searchWord?: string;
  categoryId?: number;
  regionId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const shopService = {
  getAll: (params: ShopListParams = {}) =>
    apiClient
      .get<ShopListResponse>("/shops", { params })
      .then((res) => res.data),
  getById: (id: number) =>
    apiClient.get<ShopDetail>(`/shops/${id}`).then((res) => res.data),
  // Shops currently open, based on structured backend hours data. Returns
  // an empty list until shops have structured hours - not an error.
  getOpenNow: (limit?: number) =>
    apiClient
      .get<ShopListItem[]>("/shops/open-now", { params: { limit } })
      .then((res) => res.data),
};
