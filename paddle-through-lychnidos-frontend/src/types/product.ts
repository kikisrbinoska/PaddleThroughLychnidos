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

// Mirrors PaddleThroughLychnidos.Application.Product.Queries.GetByIdResponse,
// returned by GET /api/products/{id}.
export interface ProductDetail {
  id: number;
  shopId: number;
  shopName: string;
  shopIsVerified: boolean;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Mirrors PaddleThroughLychnidos.Application.Product.Queries.MarketplaceProductListItem,
// as returned inside GetMarketplaceResponse.items by GET /api/products/marketplace.
export interface MarketplaceProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  shopId: number;
  shopName: string;
  shopIsVerified: boolean;
}

// Mirrors PaddleThroughLychnidos.Application.Product.Queries.GetMarketplaceResponse.
export interface MarketplaceProductListResponse {
  items: MarketplaceProduct[];
  metadata: ProductListMetadata;
}
