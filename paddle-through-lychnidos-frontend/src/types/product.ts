import type { ProductVideo } from "./productVideo";

// Mirrors PaddleThroughLychnidos.Domain.Entities.Product.
export interface Product {
  id: number;
  shopId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  videos: ProductVideo[];
}

// Mirrors PaddleThroughLychnidos.Application.Product.Queries.ProductListItem,
// as returned inside GetPagedResponse.items by GET /api/products.
export interface ProductListItem {
  id: number;
  shopId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface ProductListMetadata {
  totalCount: number;
  pageSize: number | null;
  pageNumber: number | null;
  totalPages: number;
}

// Mirrors PaddleThroughLychnidos.Application.Product.Queries.GetPagedResponse.
export interface ProductListResponse {
  items: ProductListItem[];
  metadata: ProductListMetadata;
}
