import type { ItineraryStop } from "./itineraryStop";

// Mirrors PaddleThroughLychnidos.Domain.Entities.ItineraryDifficulty.
// No JsonStringEnumConverter is registered for this enum's owning entity
// property (it uses HasConversion<string>() in ApplicationDbContext), and
// GetPagedHandler/GetByIdHandler both call Difficulty.ToString() before
// returning it, so the wire value is the string name, not the int.
export type ItineraryDifficulty = "Easy" | "Moderate" | "Hard";

// Mirrors PaddleThroughLychnidos.Application.Itinerary.Queries.ItineraryListDto,
// returned inside GetPagedResponse.items by GET /api/itineraries, and inside
// TravelPlanItemDto.itinerary by GET /api/travelplan.
export interface ItineraryListItem {
  id: number;
  title: string;
  coverImageUrl: string;
  durationHours: number;
  regionName: string;
  difficulty: ItineraryDifficulty;
  description: string;
  stopCount: number;
}

export interface ItineraryListMetadata {
  totalCount: number;
  pageSize: number | null;
  pageNumber: number | null;
  totalPages: number;
}

// Mirrors PaddleThroughLychnidos.Application.Itinerary.Queries.GetPagedResponse.
export interface ItineraryListResponse {
  items: ItineraryListItem[];
  metadata: ItineraryListMetadata;
}

// Mirrors PaddleThroughLychnidos.Application.Itinerary.Queries.ItineraryDetailDto,
// returned inside GetByIdResponse.itinerary by GET /api/itineraries/{id}.
export interface ItineraryDetail {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  durationHours: number;
  regionId: number;
  regionName: string;
  difficulty: ItineraryDifficulty;
  stops: ItineraryStop[];
}

// Mirrors PaddleThroughLychnidos.Application.Itinerary.Commands.CreateStopRequest /
// EditStopRequest - the admin form sends this shape for both create and edit.
export interface ItineraryStopInput {
  shopId: number;
  notes: string;
  // "hh:mm:ss" string - TimeSpan's default System.Text.Json wire format.
  suggestedTime: string;
}

export interface ItinerarySaveFields {
  title: string;
  description: string;
  coverImageUrl: string;
  durationHours: number;
  regionId: number;
  difficulty: ItineraryDifficulty;
  stops: ItineraryStopInput[];
}

// Mirrors PaddleThroughLychnidos.Application.Itinerary.Commands.CreateResponse /
// EditResponse (the fields the admin form actually uses).
export interface ItinerarySaveResponse {
  id: number;
  title: string;
  message: string;
}

// Mirrors PaddleThroughLychnidos.Application.Itinerary.Commands.DeleteResponse.
export interface ItineraryDeleteResponse {
  id: number;
  message: string;
}
