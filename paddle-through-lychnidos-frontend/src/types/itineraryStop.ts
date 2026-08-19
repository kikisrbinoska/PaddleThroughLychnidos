// Mirrors PaddleThroughLychnidos.Domain.Entities.ItineraryStop.
// TimeSpan serializes as a "hh:mm:ss" string by default via System.Text.Json.
export interface ItineraryStop {
  id: number;
  itineraryId: number;
  shopId: number;
  order: number;
  notes: string;
  suggestedTime: string;
}
