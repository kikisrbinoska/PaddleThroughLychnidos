using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }

        // Null for anonymous/tourist requests. When set, lets the shop's
        // own owner (or an admin) view/preview a Pending or Rejected shop
        // that would otherwise 404 for the public - see GetByIdHandler.
        public int? RequestingUserId { get; set; }
    }
}
