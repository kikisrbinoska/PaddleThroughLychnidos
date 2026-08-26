using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    /// <summary>
    /// Fetches a single shop for the artisan-facing edit/products/verification
    /// pages, scoped to a specific shop id (unlike GetByOwnerIdRequest, which
    /// lists every shop the owner has) and enforcing ownership.
    /// </summary>
    public class GetOwnedByIdRequest : IRequest<OwnedShopDto>
    {
        public int ShopId { get; set; }
        public int OwnerId { get; set; }
    }
}
