import type { ShopListItem } from "./shop";

// Mirrors PaddleThroughLychnidos.Domain.Entities.LearnCategory. No
// JsonStringEnumConverter override here either - unlike ItineraryDifficulty,
// Category IS configured with HasConversion<string>() in
// ApplicationDbContext, and ToString() is used explicitly in the DTOs, so
// this serializes as its string name (not an int).
export type LearnVideoCategory = "TraditionalFood" | "Crafts";

// Mirrors PaddleThroughLychnidos.Application.LearnVideo.Queries.LearnVideoListDto,
// returned inside GetPagedResponse.items by GET /api/learn/videos.
export interface LearnVideoListItem {
  id: number;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  category: LearnVideoCategory;
  publishedAt: string;
}

export interface LearnVideoListMetadata {
  totalCount: number;
  pageSize: number | null;
  pageNumber: number | null;
  totalPages: number;
}

// Mirrors PaddleThroughLychnidos.Application.LearnVideo.Queries.GetPagedResponse.
export interface LearnVideoListResponse {
  items: LearnVideoListItem[];
  metadata: LearnVideoListMetadata;
}

// Mirrors PaddleThroughLychnidos.Application.LearnVideo.Queries.LearnVideoDetailDto.
export interface LearnVideoDetail {
  id: number;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  category: LearnVideoCategory;
  publishedAt: string;
}

// Mirrors PaddleThroughLychnidos.Application.LearnVideo.Queries.GetByIdResponse,
// returned by GET /api/learn/videos/{id}.
export interface LearnVideoDetailResponse {
  video: LearnVideoDetail;
  relatedShops: ShopListItem[];
}
