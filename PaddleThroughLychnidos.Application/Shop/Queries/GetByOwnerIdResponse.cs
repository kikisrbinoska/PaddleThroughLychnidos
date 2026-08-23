namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class OwnedShopDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Story { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; } = string.Empty;
        public int? RegionId { get; set; }
        public string RegionName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string InstagramHandle { get; set; } = string.Empty;
        public string? Website { get; set; }
        public decimal? Rating { get; set; }
        public int? UserRatingCount { get; set; }
        public bool IsVerified { get; set; }
        public string OpeningHours { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? RejectionReason { get; set; }
        public int ViewCount { get; set; }
        public int SavedCount { get; set; }
        public int ReviewCount { get; set; }
        public List<string> ImageUrls { get; set; } = new();
        public bool HasPendingVerificationRequest { get; set; }
    }

    public class GetByOwnerIdResponse
    {
        // Null when the artisan has no shop yet - the Dashboard shows a
        // "Create your shop" CTA in that case.
        public OwnedShopDto? Shop { get; set; }
    }
}
