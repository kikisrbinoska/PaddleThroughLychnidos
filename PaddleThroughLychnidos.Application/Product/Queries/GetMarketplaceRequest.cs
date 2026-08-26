using MediatR;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class GetMarketplaceRequest : IRequest<GetMarketplaceResponse>
    {
        /// <summary>Page number to return (1-based). Defaults to 1.</summary>
        public int? PageNumber { get; set; }

        /// <summary>Number of items per page. Defaults to 20.</summary>
        public int? PageSize { get; set; }

        /// <summary>Free-text search matched case-insensitively against Product Name and Description (partial match).</summary>
        public string? Search { get; set; }

        /// <summary>Filters by the product's shop's Category id (products have no category of their own - see Shop.CategoryId).</summary>
        public int? CategoryId { get; set; }

        /// <summary>Filters by the product's shop's Region id.</summary>
        public int? RegionId { get; set; }

        /// <summary>Minimum price (inclusive) a product must have to be included.</summary>
        public decimal? MinPrice { get; set; }

        /// <summary>Maximum price (inclusive) a product must have to be included.</summary>
        public decimal? MaxPrice { get; set; }
    }
}
