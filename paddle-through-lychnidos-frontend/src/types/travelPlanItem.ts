// Mirrors PaddleThroughLychnidos.Domain.Entities.TravelPlanItem.
export interface TravelPlanItem {
  id: number;
  userId: number;
  shopId: number | null;
  itineraryId: number | null;
  addedAt: string;
}
