using MediatR;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public int UserId { get; set; }
        public int ShopId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}
