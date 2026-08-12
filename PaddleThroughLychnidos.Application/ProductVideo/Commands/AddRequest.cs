using MediatR;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public int ProductId { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
    }
}
