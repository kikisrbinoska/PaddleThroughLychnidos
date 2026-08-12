using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class ShopListItem
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int RegionId { get; set; }
        public int CategoryId { get; set; }
        public bool IsVerified { get; set; }
    }

    public class GetPagedResponse
    {
        public List<ShopListItem> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
