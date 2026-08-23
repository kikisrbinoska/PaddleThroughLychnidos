import apiClient from "./apiClient";
import type { AdminRegion, Region } from "../types";

export interface RegionFields {
  name: string;
  description: string;
  polygonGeoJson: string;
}

export const regionService = {
  getAll: () => apiClient.get<Region[]>("/regions").then((res) => res.data),
  getById: (id: number) =>
    apiClient.get<Region>(`/regions/${id}`).then((res) => res.data),

  // Admin-only below - apiClient's interceptor attaches the bearer token,
  // and the API requires the Administrator role. See RegionsController.
  getAllForAdmin: () =>
    apiClient.get<AdminRegion[]>("/regions/admin").then((res) => res.data),
  create: (fields: RegionFields) =>
    apiClient
      .post<{ id: number; message: string }>("/regions", fields)
      .then((res) => res.data),
  update: (id: number, fields: RegionFields) =>
    apiClient
      .put<{ id: number; message: string }>(`/regions/${id}`, fields)
      .then((res) => res.data),
  remove: (id: number) =>
    apiClient
      .delete<{ id: number; message: string }>(`/regions/${id}`)
      .then((res) => res.data),
};
