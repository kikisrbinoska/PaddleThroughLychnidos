import apiClient from "./apiClient";
import type {
  TravelPlanAddResponse,
  TravelPlanResponse,
} from "../types/travelPlan";

// All endpoints require auth (JWT identifies the user - there is no
// userId param); apiClient's interceptor attaches the bearer token.
export const travelPlanService = {
  getAll: () =>
    apiClient.get<TravelPlanResponse>("/travelplan").then((res) => res.data),
  addShop: (shopId: number) =>
    apiClient
      .post<TravelPlanAddResponse>("/travelplan", { shopId })
      .then((res) => res.data),
  addItinerary: (itineraryId: number) =>
    apiClient
      .post<TravelPlanAddResponse>("/travelplan", { itineraryId })
      .then((res) => res.data),
  remove: (id: number) =>
    apiClient.delete(`/travelplan/${id}`).then((res) => res.data),
};
