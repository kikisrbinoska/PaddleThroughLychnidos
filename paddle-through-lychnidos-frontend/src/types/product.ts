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
