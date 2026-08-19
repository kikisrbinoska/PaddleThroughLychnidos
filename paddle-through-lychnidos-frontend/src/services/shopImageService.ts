import apiClient from "./apiClient";
import type { ShopImage } from "../types";

export const shopImageService = {
  getByShopId: (shopId: number) =>
    apiClient
      .get<ShopImage[]>("/shopimages", { params: { shopId } })
      .then((res) => res.data),
};
