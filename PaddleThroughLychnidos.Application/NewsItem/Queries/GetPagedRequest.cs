using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.NewsItem.Queries
{
    public class GetPagedRequest : IRequest<GetPagedResponse>
    {
        /// <summary>Optional category filter. Omit to return all categories.</summary>
        public NewsCategory? Category { get; set; }

        /// <summary>Page number to return (1-based). Defaults to 1.</summary>
        public int? PageNumber { get; set; }

        /// <summary>Number of items per page. Defaults to 20.</summary>
        public int? PageSize { get; set; }
    }
}
