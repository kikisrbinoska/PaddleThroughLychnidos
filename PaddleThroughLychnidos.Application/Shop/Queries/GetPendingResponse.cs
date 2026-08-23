namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class PendingShopDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? OwnerId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerEmail { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string RegionName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class GetPendingResponse
    {
        public List<PendingShopDto> Items { get; set; } = new();
    }
}
