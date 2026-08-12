using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IRegionRepository _regionRepository;

        public EditHandler(IRegionRepository regionRepository)
        {
            _regionRepository = regionRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var region = await _regionRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);

            region.Name = request.Name;
            region.Description = request.Description;
            region.PolygonGeoJson = request.PolygonGeoJson;

            await _regionRepository.UpdateAsync(region);

            return new EditResponse
            {
                Id = region.Id,
                Name = region.Name,
                Description = region.Description,
                PolygonGeoJson = region.PolygonGeoJson,
                Message = "Region updated successfully",
            };
        }
    }
}
