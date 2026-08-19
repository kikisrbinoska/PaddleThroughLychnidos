// Mirrors PaddleThroughLychnidos.Domain.Entities.Review.
export interface Review {
  id: number;
  userId: number;
  shopId: number;
  rating: number;
  comment: string;
  createdAt: string;
}
