using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly IRegionRepository _regionRepository;

        public GetByIdHandler(IRegionRepository regionRepository)
        {
            _regionRepository = regionRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var region = await _regionRepository.GetByIdAsync(request.Id);
            if (region == null)
            {
                throw new PaddleThroughLychnidosException($"Region with Id {request.Id} not found.", HttpStatusCode.NotFound);
            }

            return new GetByIdResponse
            {
                Id = region.Id,
                Name = region.Name,
                Description = region.Description,
                PolygonGeoJson = region.PolygonGeoJson,
            };
        }
    }
}
