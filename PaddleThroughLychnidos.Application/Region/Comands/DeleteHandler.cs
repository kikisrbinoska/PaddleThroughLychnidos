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

            // Itinerary.RegionId is required (non-nullable), so a region in
            // use by an itinerary can't be safely unassigned the way shops
            // are below - block the delete instead.
            var itineraryCount = await _regionRepository.GetItineraryCountAsync(request.Id);
            if (itineraryCount > 0)
            {
                throw new PaddleThroughLychnidosException(
                    $"Cannot delete this region - {itineraryCount} itinerary(ies) still use it. Reassign or delete those itineraries first.",
                    HttpStatusCode.Conflict);
            }

            // Shop.RegionId is optional, so shops using this region are
            // unassigned (not blocked/cascade-deleted) rather than
            // preventing the region from being deleted.
            await _regionRepository.UnassignShopsAsync(request.Id);

            await _regionRepository.DeleteAsync(region);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Region deleted successfully",
            };
        }
    }
}
