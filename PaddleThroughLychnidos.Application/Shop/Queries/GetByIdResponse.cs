namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetByIdResponse
    {
        public int Id { get; set; }
        public int? OwnerId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
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
        public string WhatsappNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string InstagramHandle { get; set; } = string.Empty;
        public bool IsVerified { get; set; }
        public string OpeningHours { get; set; } = string.Empty;
    }
}
