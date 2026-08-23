using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetForAdminHandler : IRequestHandler<GetForAdminRequest, List<GetForAdminResponse>>
    {
        private readonly IRegionRepository _regionRepository;

        public GetForAdminHandler(IRegionRepository regionRepository)
        {
            _regionRepository = regionRepository;
        }

        public async Task<List<GetForAdminResponse>> Handle(GetForAdminRequest request, CancellationToken cancellationToken)
        {
            var regions = await _regionRepository.GetAllAsync();

            var items = new List<GetForAdminResponse>();
            foreach (var region in regions)
            {
                items.Add(new GetForAdminResponse
                {
                    Id = region.Id,
                    Name = region.Name,
                    Description = region.Description,
                    PolygonGeoJson = region.PolygonGeoJson,
                    ShopCount = await _regionRepository.GetShopCountAsync(region.Id),
                    ItineraryCount = await _regionRepository.GetItineraryCountAsync(region.Id),
                });
            }

            return items;
        }
    }
}
