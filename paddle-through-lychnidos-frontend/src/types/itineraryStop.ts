import type { TravelPlanShopSummary } from "./travelPlan";

// Mirrors PaddleThroughLychnidos.Application.Itinerary.Queries.ItineraryStopDto,
// returned inside GetByIdResponse.itinerary.stops by GET /api/itineraries/{id}.
// TimeSpan serializes as a "hh:mm:ss" string by default via System.Text.Json.
export interface ItineraryStop {
  order: number;
  notes: string;
  suggestedTime: string;
  shop: TravelPlanShopSummary;
}
