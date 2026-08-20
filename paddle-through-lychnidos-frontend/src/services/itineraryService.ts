import apiClient from "./apiClient";
import type { ItineraryDetail, ItineraryListResponse } from "../types";

export interface ItineraryListParams {
  regionId?: number;
  minDurationHours?: number;
  maxDurationHours?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface ItineraryDetailResponse {
  itinerary: ItineraryDetail;
}

export const itineraryService = {
  getAll: (params: ItineraryListParams = {}) =>
    apiClient
      .get<ItineraryListResponse>("/itineraries", { params })
      .then((res) => res.data),
  getById: (id: number) =>
    apiClient
      .get<ItineraryDetailResponse>(`/itineraries/${id}`)
      .then((res) => res.data.itinerary),
};
