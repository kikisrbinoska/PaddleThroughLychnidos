// Mirrors PaddleThroughLychnidos.Application.Review.Queries.ReviewListItemDto,
// returned inside GetResponse.items by GET /api/reviews and
// GET /api/shops/{shopId}/reviews.
export interface ReviewListItem {
  id: number;
  userId: number;
  userName: string;
  shopId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewListMetadata {
  totalCount: number;
  pageSize: number | null;
  pageNumber: number | null;
  totalPages: number;
}

// Mirrors PaddleThroughLychnidos.Application.Review.Queries.GetResponse.
export interface ReviewListResponse {
  items: ReviewListItem[];
  metadata: ReviewListMetadata;
}

// Mirrors PaddleThroughLychnidos.Application.Review.Commands.AddResponse.
export interface ReviewAddResponse {
  id: number;
  userId: number;
  shopId: number;
  rating: number;
  comment: string;
  createdAt: string;
  isNewStamp: boolean;
  message: string;
}

// Mirrors PaddleThroughLychnidos.Application.Review.Commands.EditResponse.
export interface ReviewEditResponse {
  id: number;
  userId: number;
  shopId: number;
  rating: number;
  comment: string;
  createdAt: string;
  message: string;
}
