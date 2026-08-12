using MediatR;

namespace PaddleThroughLychnidos.Application.Review.Queries
{
    public class GetRequest : IRequest<List<GetResponse>>
    {
        public int? ShopId { get; set; }
        public int? UserId { get; set; }
    }
}
