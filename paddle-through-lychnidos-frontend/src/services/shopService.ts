import apiClient from "./apiClient";
import type { ShopDetail, ShopListResponse } from "../types";

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
};
