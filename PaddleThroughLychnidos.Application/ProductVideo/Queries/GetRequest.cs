using MediatR;

namespace PaddleThroughLychnidos.Application.ProductVideo.Queries
{
    public class GetRequest : IRequest<List<GetResponse>>
    {
        public int? ProductId { get; set; }
    }
}
