using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class ApproveHandler : IRequestHandler<ApproveRequest, ApproveResponse>
    {
        private readonly IShopRepository _shopRepository;

        public ApproveHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<ApproveResponse> Handle(ApproveRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            shop.Status = ShopStatus.Approved;
            shop.RejectionReason = null;

            await _shopRepository.UpdateAsync(shop);

            return new ApproveResponse
            {
                Id = shop.Id,
                Status = shop.Status.ToString(),
                Message = "Shop approved",
            };
        }
    }
}
