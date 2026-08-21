using MediatR;

namespace PaddleThroughLychnidos.Application.Review.Queries
{
    public class GetRequest : IRequest<GetResponse>
    {
        public int? ShopId { get; set; }
        public int? UserId { get; set; }

        /// <summary>Page number to return (1-based). Defaults to 1.</summary>
        public int? PageNumber { get; set; }

        /// <summary>Number of items per page. Defaults to 20.</summary>
        public int? PageSize { get; set; }
    }
}
