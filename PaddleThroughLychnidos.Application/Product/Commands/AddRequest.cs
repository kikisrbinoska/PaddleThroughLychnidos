using MediatR;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public int ShopId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
