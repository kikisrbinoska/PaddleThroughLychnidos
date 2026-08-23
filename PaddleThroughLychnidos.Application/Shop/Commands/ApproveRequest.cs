using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class ApproveRequest : IRequest<ApproveResponse>
    {
        public int ShopId { get; set; }
        public int AdminId { get; set; }
    }
}
