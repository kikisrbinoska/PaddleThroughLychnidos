import type { ItineraryListItem } from "./itinerary";

// Mirrors PaddleThroughLychnidos.Application.Shared.ShopSummaryDto.
export interface TravelPlanShopSummary {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

// Mirrors PaddleThroughLychnidos.Application.TravelPlan.Queries.TravelPlanItemDto,
// returned inside GetByUserIdResponse.items by GET /api/travelplan. Exactly
// one of shop/itinerary is non-null, matching AddValidator's XOR rule.
export interface TravelPlanEntry {
  id: number;
  addedAt: string;
  shop: TravelPlanShopSummary | null;
  itinerary: ItineraryListItem | null;
}

// Mirrors PaddleThroughLychnidos.Application.TravelPlan.Queries.GetByUserIdResponse.
export interface TravelPlanResponse {
  items: TravelPlanEntry[];
}

// Mirrors PaddleThroughLychnidos.Application.TravelPlan.Commands.AddResponse.
export interface TravelPlanAddResponse {
  id: number;
  userId: number;
  shopId: number | null;
  itineraryId: number | null;
  addedAt: string;
  message: string;
}
