using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class ProductListItem
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class GetPagedResponse
    {
        public List<ProductListItem> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
