import type { ItineraryStop } from "./itineraryStop";

// Mirrors PaddleThroughLychnidos.Domain.Entities.ItineraryDifficulty.
// No JsonStringEnumConverter is registered in the API, so System.Text.Json
// serializes this enum as its underlying int value.
export const ItineraryDifficulty = {
  Easy: 0,
  Moderate: 1,
  Hard: 2,
} as const;

export type ItineraryDifficulty =
  (typeof ItineraryDifficulty)[keyof typeof ItineraryDifficulty];

// Mirrors PaddleThroughLychnidos.Domain.Entities.Itinerary.
export interface Itinerary {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  durationHours: number;
  regionId: number;
  difficulty: ItineraryDifficulty;
  stops: ItineraryStop[];
}
