import apiClient from "./apiClient";
import type {
  MyShopResponse,
  ShopFormFields,
  ShopImageUploadResponse,
  ShopResubmitResponse,
  ShopSaveResponse,
  VerificationSubmitResponse,
} from "../types";

// All endpoints require auth as an Artisan - apiClient's interceptor
// attaches the bearer token, and the API derives the current user (and
// checks shop ownership) from it. See ArtisanController.
export const artisanService = {
  getMyShop: () =>
    apiClient.get<MyShopResponse>("/artisan/my-shop").then((res) => res.data),

  createShop: (fields: ShopFormFields) =>
    apiClient
      .post<ShopSaveResponse>("/artisan/shop", fields)
      .then((res) => res.data),

  updateShop: (shopId: number, fields: ShopFormFields) =>
    apiClient
      .put<ShopSaveResponse>(`/artisan/shop/${shopId}`, fields)
      .then((res) => res.data),

  resubmitShop: (shopId: number) =>
    apiClient
      .post<ShopResubmitResponse>(`/artisan/shop/${shopId}/resubmit`)
      .then((res) => res.data),

  uploadShopImage: (shopId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<ShopImageUploadResponse>(`/artisan/shop/${shopId}/images`, formData)
      .then((res) => res.data);
  },

  uploadProductImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<{ url: string }>("/artisan/product-images", formData)
      .then((res) => res.data.url);
  },

  submitVerification: (shopId: number, notes: string, files: File[]) => {
    const formData = new FormData();
    formData.append("shopId", String(shopId));
    formData.append("notes", notes);
    files.forEach((file) => formData.append("files", file));
    return apiClient
      .post<VerificationSubmitResponse>("/artisan/verification", formData)
      .then((res) => res.data);
  },
};
