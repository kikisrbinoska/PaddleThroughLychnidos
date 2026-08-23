using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class ResubmitRequest : IRequest<ResubmitResponse>
    {
        public int ShopId { get; set; }
        public int OwnerId { get; set; }
    }
}
