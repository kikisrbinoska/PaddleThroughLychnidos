using MediatR;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public int ShopId { get; set; }

        // Never trust a client-supplied value here - the controller
        // overwrites this from the authenticated user's JWT claims before
        // dispatching. Used to verify the requester owns ShopId.
        public int RequestingUserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
