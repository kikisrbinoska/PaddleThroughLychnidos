using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetPagedRequest : IRequest<GetPagedResponse>
    {
        /// <summary>Page number to return (1-based). Defaults to 1.</summary>
        public int? PageNumber { get; set; }

        /// <summary>Number of items per page. Defaults to 20.</summary>
        public int? PageSize { get; set; }

        /// <summary>Free-text search matched case-insensitively against Shop Name and Description (partial match).</summary>
        public string? SearchWord { get; set; }

        /// <summary>Filters shops belonging to the given Category (craft type) id.</summary>
        public int? CategoryId { get; set; }

        /// <summary>Filters shops belonging to the given Region id.</summary>
        public int? RegionId { get; set; }
    }
}
