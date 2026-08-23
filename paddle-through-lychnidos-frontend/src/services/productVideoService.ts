import apiClient from "./apiClient";
import type { ProductVideo } from "../types";

export const productVideoService = {
  getByProductId: (productId: number) =>
    apiClient
      .get<ProductVideo[]>("/productvideos", { params: { productId } })
      .then((res) => res.data),
  create: (productId: number, videoUrl: string) =>
    apiClient
      .post<ProductVideo & { message: string }>("/productvideos", { productId, videoUrl })
      .then((res) => res.data),
};
