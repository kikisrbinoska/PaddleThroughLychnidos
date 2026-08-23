using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetPendingHandler : IRequestHandler<GetPendingRequest, GetPendingResponse>
    {
        private readonly IShopRepository _shopRepository;

        public GetPendingHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<GetPendingResponse> Handle(GetPendingRequest request, CancellationToken cancellationToken)
        {
            var shops = await _shopRepository.GetPendingAsync();

            var items = shops
                .Select(shop => new PendingShopDto
                {
                    Id = shop.Id,
                    Name = shop.Name,
                    Description = shop.Description,
                    OwnerId = shop.OwnerId,
                    OwnerName = shop.Owner?.Name ?? "Unknown",
                    OwnerEmail = shop.Owner?.Email ?? string.Empty,
                    CategoryName = shop.Category.Name,
                    RegionName = shop.Region?.Name ?? "Unassigned",
                    CreatedAt = shop.CreatedAt,
                })
                .ToList();

            return new GetPendingResponse { Items = items };
        }
    }
}
