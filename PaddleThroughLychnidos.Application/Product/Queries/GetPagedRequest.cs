using MediatR;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class GetPagedRequest : IRequest<GetPagedResponse>
    {
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string? SearchWord { get; set; }
        public string? Tag { get; set; }
    }
}
