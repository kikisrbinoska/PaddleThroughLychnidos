using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class SelectMembershipHandler : IRequestHandler<SelectMembershipRequest, SelectMembershipResponse>
    {
        private readonly IShopRepository _shopRepository;

        public SelectMembershipHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<SelectMembershipResponse> Handle(SelectMembershipRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            if (shop.OwnerId != request.OwnerId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to manage this shop's membership", HttpStatusCode.Forbidden);
            }

            shop.MembershipTier = request.Tier;
            shop.MembershipActivatedAt = request.Tier == MembershipTier.Premium ? DateTime.UtcNow : null;

            await _shopRepository.UpdateAsync(shop);

            return new SelectMembershipResponse
            {
                ShopId = shop.Id,
                MembershipTier = shop.MembershipTier,
                MembershipActivatedAt = shop.MembershipActivatedAt,
                Message = shop.MembershipTier == MembershipTier.Premium
                    ? "Premium activated"
                    : "Switched to Free plan",
            };
        }
    }
}
