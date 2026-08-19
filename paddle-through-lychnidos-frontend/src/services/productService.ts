import apiClient from "./apiClient";
import type { Product } from "../types";

export const productService = {
  getByShopId: (shopId: number) =>
    apiClient
      .get<Product[]>(`/shops/${shopId}/products`)
      .then((res) => res.data),
  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`).then((res) => res.data),
};
