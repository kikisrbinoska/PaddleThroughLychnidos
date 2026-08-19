using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class ShopListItem
    {
        public int Id { get; set; }
        public int? OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; } = string.Empty;
        public int? RegionId { get; set; }
        public string RegionName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public decimal? Rating { get; set; }
        public int? UserRatingCount { get; set; }
        public bool IsVerified { get; set; }
        public string OpeningHours { get; set; } = string.Empty;
        // Null when the shop has no structured hours data yet (true for
        // all shops imported from Google Places so far) - "unknown", not
        // "closed". Only true/false once structured hours exist.
        public bool? IsOpenNow { get; set; }
    }

    public class GetPagedResponse
    {
        public List<ShopListItem> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
