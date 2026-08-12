using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetHandler : IRequestHandler<GetRequest, List<GetResponse>>
    {
        private readonly IRegionRepository _regionRepository;

        public GetHandler(IRegionRepository regionRepository)
        {
            _regionRepository = regionRepository;
        }

        public async Task<List<GetResponse>> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var regions = await _regionRepository.GetAllAsync();

            return regions
                .Select(region => new GetResponse
                {
                    Id = region.Id,
                    Name = region.Name,
                    Description = region.Description,
                    PolygonGeoJson = region.PolygonGeoJson,
                })
                .ToList();
        }
    }
}
