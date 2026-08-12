using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IRegionRepository _regionRepository;

        public DeleteHandler(IRegionRepository regionRepository)
        {
            _regionRepository = regionRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var region = await _regionRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);

            await _regionRepository.DeleteAsync(region);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Region deleted successfully",
            };
        }
    }
}
