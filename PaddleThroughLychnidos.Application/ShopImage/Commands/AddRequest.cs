using MediatR;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public int ShopId { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
