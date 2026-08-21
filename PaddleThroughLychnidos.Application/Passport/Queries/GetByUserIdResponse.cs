namespace PaddleThroughLychnidos.Application.Passport.Queries
{
    public class PassportStampDto
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string ShopName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string RegionName { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public DateTime VisitedAt { get; set; }
    }

    public class GetByUserIdResponse
    {
        public List<PassportStampDto> Stamps { get; set; } = new();
        public int TotalCount { get; set; }
    }
}
