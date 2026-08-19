import apiClient from "./apiClient";
import type { Region } from "../types";

export const regionService = {
  getAll: () => apiClient.get<Region[]>("/regions").then((res) => res.data),
  getById: (id: number) =>
    apiClient.get<Region>(`/regions/${id}`).then((res) => res.data),
};
