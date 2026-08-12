using MediatR;

namespace PaddleThroughLychnidos.Application.ShopImage.Queries
{
    public class GetRequest : IRequest<List<GetResponse>>
    {
        public int? ShopId { get; set; }
    }
}
