using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class RejectHandler : IRequestHandler<RejectRequest, RejectResponse>
    {
        private readonly IShopRepository _shopRepository;

        public RejectHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<RejectResponse> Handle(RejectRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            shop.Status = ShopStatus.Rejected;
            shop.RejectionReason = request.Reason;

            await _shopRepository.UpdateAsync(shop);

            return new RejectResponse
            {
                Id = shop.Id,
                Status = shop.Status.ToString(),
                RejectionReason = shop.RejectionReason,
                Message = "Shop rejected",
            };
        }
    }
}
