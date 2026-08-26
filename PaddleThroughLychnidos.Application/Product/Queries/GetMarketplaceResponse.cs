using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class MarketplaceProductListItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        public int ShopId { get; set; }
        public string ShopName { get; set; } = string.Empty;
        public bool ShopIsVerified { get; set; }
    }

    public class GetMarketplaceResponse
    {
        public List<MarketplaceProductListItem> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
