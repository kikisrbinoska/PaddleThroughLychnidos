using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly IRegionRepository _regionRepository;

        public AddHandler(IRegionRepository regionRepository)
        {
            _regionRepository = regionRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            var region = new Domain.Entities.Region
            {
                Name = request.Name,
                Description = request.Description,
                PolygonGeoJson = request.PolygonGeoJson,
            };

            await _regionRepository.AddAsync(region);

            return new AddResponse
            {
                Id = region.Id,
                Name = region.Name,
                Description = region.Description,
                PolygonGeoJson = region.PolygonGeoJson,
                Message = "Region created successfully",
            };
        }
    }
}
