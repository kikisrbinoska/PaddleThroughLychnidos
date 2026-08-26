using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class BackfillShopRegionsHandler : IRequestHandler<BackfillShopRegionsRequest, BackfillShopRegionsResponse>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IRegionRepository _regionRepository;

        public BackfillShopRegionsHandler(IShopRepository shopRepository, IRegionRepository regionRepository)
        {
            _shopRepository = shopRepository;
            _regionRepository = regionRepository;
        }

        public async Task<BackfillShopRegionsResponse> Handle(BackfillShopRegionsRequest request, CancellationToken cancellationToken)
        {
            var unassignedShops = await _shopRepository.GetWithoutRegionAsync();
            var regions = (await _regionRepository.GetAllAsync()).ToList();

            var matchedCount = 0;
            foreach (var shop in unassignedShops)
            {
                var matchedRegion = regions.FirstOrDefault(r =>
                    PointInPolygonHelper.Contains(r.PolygonGeoJson, shop.Latitude, shop.Longitude));

                if (matchedRegion is null)
                {
                    continue;
                }

                shop.RegionId = matchedRegion.Id;
                await _shopRepository.UpdateAsync(shop);
                matchedCount++;
            }

            return new BackfillShopRegionsResponse
            {
                TotalUnassignedChecked = unassignedShops.Count,
                TotalMatched = matchedCount,
                Message = $"Matched {matchedCount} of {unassignedShops.Count} unassigned shops to a region.",
            };
        }
    }
}
