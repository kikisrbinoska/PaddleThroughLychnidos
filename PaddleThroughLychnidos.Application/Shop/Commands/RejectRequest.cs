using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class RejectRequest : IRequest<RejectResponse>
    {
        public int ShopId { get; set; }
        public int AdminId { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
