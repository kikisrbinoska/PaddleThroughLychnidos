// Mirrors PaddleThroughLychnidos.Domain.Entities.NewsCategory. Serializes as
// its string name (Category is configured with HasConversion<string>() in
// ApplicationDbContext), same as LearnVideoCategory.
export type NewsItemCategory =
  | "CurrentEvent"
  | "UpcomingEvent"
  | "Exhibition"
  | "GeneralNews";

// Mirrors PaddleThroughLychnidos.Application.NewsItem.Queries.NewsItemListDto,
// returned inside GetPagedResponse.items by GET /api/news.
export interface NewsItemListEntry {
  id: number;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  thumbnailUrl: string;
  category: NewsItemCategory;
  publishedAt: string;
}

export interface NewsItemListMetadata {
  totalCount: number;
  pageSize: number | null;
  pageNumber: number | null;
  totalPages: number;
}

// Mirrors PaddleThroughLychnidos.Application.NewsItem.Queries.GetPagedResponse.
export interface NewsItemListResponse {
  items: NewsItemListEntry[];
  metadata: NewsItemListMetadata;
}

// Mirrors PaddleThroughLychnidos.Application.NewsItem.Queries.NewsItemDetailDto.
export interface NewsItemDetail {
  id: number;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  thumbnailUrl: string;
  category: NewsItemCategory;
  publishedAt: string;
}

// Mirrors PaddleThroughLychnidos.Application.NewsItem.Queries.GetByIdResponse,
// returned by GET /api/news/{id}.
export interface NewsItemDetailResponse {
  newsItem: NewsItemDetail;
}
