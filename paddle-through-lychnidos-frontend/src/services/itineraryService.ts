import apiClient from "./apiClient";
import type { Itinerary } from "../types";

export const itineraryService = {
  getAll: () =>
    apiClient.get<Itinerary[]>("/itineraries").then((res) => res.data),
  getById: (id: number) =>
    apiClient.get<Itinerary>(`/itineraries/${id}`).then((res) => res.data),
};
