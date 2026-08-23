import apiClient from "./apiClient";
import type {
  ItineraryDeleteResponse,
  ItineraryDetail,
  ItineraryListResponse,
  ItinerarySaveFields,
  ItinerarySaveResponse,
} from "../types";

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

  // Admin-only below - apiClient's interceptor attaches the bearer token,
  // and the API requires the Administrator role. See ItinerariesController.
  create: (fields: ItinerarySaveFields) =>
    apiClient
      .post<ItinerarySaveResponse>("/itineraries", fields)
      .then((res) => res.data),
  update: (id: number, fields: ItinerarySaveFields) =>
    apiClient
      .put<ItinerarySaveResponse>(`/itineraries/${id}`, fields)
      .then((res) => res.data),
  remove: (id: number) =>
    apiClient
      .delete<ItineraryDeleteResponse>(`/itineraries/${id}`)
      .then((res) => res.data),
};
