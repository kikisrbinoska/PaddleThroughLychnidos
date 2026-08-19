using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetOpenNowHandler : IRequestHandler<GetOpenNowRequest, List<ShopListItem>>
    {
        private readonly IShopRepository _shopRepository;

        public GetOpenNowHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<List<ShopListItem>> Handle(GetOpenNowRequest request, CancellationToken cancellationToken)
        {
            var limit = request.Limit.GetValueOrDefault(10) < 1 ? 10 : request.Limit.GetValueOrDefault(10);
            var now = DateTimeOffset.Now;

            var (_, allShops) = await _shopRepository.GetPagedAsync(
                pageNumber: null,
                pageSize: null,
                searchWord: null,
                categoryId: null,
                regionId: null);

            return allShops
                .Select(shop => new
                {
                    Shop = shop,
                    IsOpenNow = OpenNowCalculator.IsOpenAt(shop.StructuredHoursJson, now),
                })
                .Where(x => x.IsOpenNow == true)
                .Take(limit)
                .Select(x => new ShopListItem
                {
                    Id = x.Shop.Id,
                    OwnerId = x.Shop.OwnerId,
                    Name = x.Shop.Name,
                    Description = x.Shop.Description,
                    Latitude = x.Shop.Latitude,
                    Longitude = x.Shop.Longitude,
                    Address = x.Shop.Address,
                    RegionId = x.Shop.RegionId,
                    RegionName = x.Shop.Region?.Name ?? "Unassigned",
                    CategoryId = x.Shop.CategoryId,
                    CategoryName = x.Shop.Category.Name,
                    ImageUrl = x.Shop.Images.Select(i => i.Url).FirstOrDefault() ?? string.Empty,
                    Rating = x.Shop.Rating,
                    UserRatingCount = x.Shop.UserRatingCount,
                    IsVerified = x.Shop.IsVerified,
                    OpeningHours = x.Shop.OpeningHours,
                    IsOpenNow = x.IsOpenNow,
                })
                .ToList();
        }
    }
}
