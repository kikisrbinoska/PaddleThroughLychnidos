// Mirrors PaddleThroughLychnidos.Application.Passport.Queries.PassportStampDto,
// returned inside GetByUserIdResponse.stamps by GET /api/passport.
export interface PassportStamp {
  id: number;
  shopId: number;
  shopName: string;
  categoryName: string;
  regionName: string;
  thumbnailUrl: string;
  visitedAt: string;
}

// Mirrors PaddleThroughLychnidos.Application.Passport.Queries.GetByUserIdResponse.
export interface PassportResponse {
  stamps: PassportStamp[];
  totalCount: number;
}
