// Mirrors PaddleThroughLychnidos.Application.Shared.ShopSummaryDto.
export interface TravelPlanShopSummary {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

// Mirrors PaddleThroughLychnidos.Application.TravelPlan.Queries.TravelPlanItemDto,
// returned inside GetByUserIdResponse.items by GET /api/travelplan.
export interface TravelPlanEntry {
  id: number;
  addedAt: string;
  shop: TravelPlanShopSummary | null;
  // Itinerary summary shape isn't needed by the shop detail page's "add to
  // plan" toggle - left untyped (unused) rather than guessed.
  itinerary: unknown | null;
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
