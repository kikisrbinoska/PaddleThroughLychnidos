import apiClient from "./apiClient";
import type {
  MembershipTier,
  MyShopsResponse,
  OwnedShop,
  SelectMembershipResponse,
  ShopFormFields,
  ShopImageUploadResponse,
  ShopResubmitResponse,
  ShopSaveResponse,
  VerificationSubmitResponse,
} from "../types";

// All endpoints require auth as an Artisan - apiClient's interceptor
// attaches the bearer token, and the API derives the current user (and
// checks shop ownership) from it. See ArtisanController. An artisan may own
// more than one shop - getMyShops lists all of them, getShop fetches one by
// id (owner-checked server-side).
export const artisanService = {
  getMyShops: () =>
    apiClient.get<MyShopsResponse>("/artisan/shops").then((res) => res.data),

  getShop: (shopId: number) =>
    apiClient.get<OwnedShop>(`/artisan/shops/${shopId}`).then((res) => res.data),

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

  // Simulated membership selection - no payment gateway involved, this
  // literally just flips Shop.MembershipTier on click. See
  // Shop.Commands.SelectMembershipCommand.
  selectMembership: (shopId: number, tier: MembershipTier) =>
    apiClient
      .post<SelectMembershipResponse>(`/artisan/shop/${shopId}/membership`, { tier })
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
