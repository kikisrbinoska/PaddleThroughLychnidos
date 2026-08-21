// Mirrors PaddleThroughLychnidos.Application.Shared.ShopSummaryDto.
export interface DayPlanShopSummary {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

// Mirrors PaddleThroughLychnidos.Application.DayPlan.Queries.DayPlanStopDto.
export interface DayPlanStop {
  order: number;
  shop: DayPlanShopSummary;
}

// Mirrors PaddleThroughLychnidos.Application.DayPlan.Queries.DayPlanDto,
// returned inside GetByUserIdResponse.plans by GET /api/dayplans.
export interface DayPlanEntry {
  id: number;
  title: string;
  date: string;
  stops: DayPlanStop[];
}

// Mirrors PaddleThroughLychnidos.Application.DayPlan.Queries.GetByUserIdResponse.
export interface DayPlanListResponse {
  plans: DayPlanEntry[];
}

// Mirrors PaddleThroughLychnidos.Application.DayPlan.Commands.CreateResponse.
export interface DayPlanCreateResponse {
  id: number;
  title: string;
  date: string;
  stops: { shopId: number; shopName: string; order: number }[];
  message: string;
}
