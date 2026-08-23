using MediatR;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class EditRequest : IRequest<EditResponse>
    {
        public int Id { get; set; }

        // Never trust a client-supplied value here - the controller
        // overwrites this from the authenticated user's JWT claims before
        // dispatching. Used to verify the requester owns this product's shop.
        public int RequestingUserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
