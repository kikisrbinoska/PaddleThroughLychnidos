using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    // A deliberate, explicit action (not an implicit side effect of saving
    // an edit) - see task discussion on why editing a Rejected shop alone
    // should not silently flip it back to Pending.
    public class ResubmitHandler : IRequestHandler<ResubmitRequest, ResubmitResponse>
    {
        private readonly IShopRepository _shopRepository;

        public ResubmitHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<ResubmitResponse> Handle(ResubmitRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            if (shop.OwnerId != request.OwnerId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to resubmit this shop", HttpStatusCode.Forbidden);
            }

            if (shop.Status != ShopStatus.Rejected)
            {
                throw new PaddleThroughLychnidosException("Only a rejected shop can be resubmitted", HttpStatusCode.BadRequest);
            }

            shop.Status = ShopStatus.Pending;
            shop.RejectionReason = null;

            await _shopRepository.UpdateAsync(shop);

            return new ResubmitResponse
            {
                Id = shop.Id,
                Status = shop.Status.ToString(),
                Message = "Your shop has been resubmitted for review.",
            };
        }
    }
}
