import apiClient from "./apiClient";
import type {
  MarketplaceProductListResponse,
  ProductDetail,
  ProductListResponse,
} from "../types";

export interface ProductFormFields {
  shopId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface ProductSaveResponse {
  id: number;
  shopId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  message: string;
}

export interface MarketplaceParams {
  search?: string;
  categoryId?: number;
  regionId?: number;
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const productService = {
  getByShopId: (shopId: number, pageSize = 50) =>
    apiClient
      .get<ProductListResponse>("/products", { params: { shopId, pageSize } })
      .then((res) => res.data.items),
  getById: (id: number) =>
    apiClient.get<ProductDetail>(`/products/${id}`).then((res) => res.data),
  getMarketplace: (params: MarketplaceParams = {}) =>
    apiClient
      .get<MarketplaceProductListResponse>("/products/marketplace", { params })
      .then((res) => res.data),
  create: (fields: ProductFormFields) =>
    apiClient
      .post<ProductSaveResponse>("/products", fields)
      .then((res) => res.data),
  update: (id: number, fields: Omit<ProductFormFields, "shopId">) =>
    apiClient
      .put<ProductSaveResponse>(`/products/${id}`, fields)
      .then((res) => res.data),
  remove: (id: number) =>
    apiClient.delete(`/products/${id}`).then((res) => res.data),
};
