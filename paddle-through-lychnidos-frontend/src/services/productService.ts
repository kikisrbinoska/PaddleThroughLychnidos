import apiClient from "./apiClient";
import type { Product, ProductListResponse } from "../types";

export const productService = {
  getByShopId: (shopId: number, pageSize = 50) =>
    apiClient
      .get<ProductListResponse>("/products", { params: { shopId, pageSize } })
      .then((res) => res.data.items),
  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`).then((res) => res.data),
};
