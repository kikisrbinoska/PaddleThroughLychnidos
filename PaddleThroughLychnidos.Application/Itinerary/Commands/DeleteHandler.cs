using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IItineraryRepository _itineraryRepository;
        private readonly ITravelPlanItemRepository _travelPlanItemRepository;

        public DeleteHandler(IItineraryRepository itineraryRepository, ITravelPlanItemRepository travelPlanItemRepository)
        {
            _itineraryRepository = itineraryRepository;
            _travelPlanItemRepository = travelPlanItemRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var itinerary = await _itineraryRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Itinerary not found", HttpStatusCode.NotFound);

            // TravelPlanItem.ItineraryId is Restrict (see
            // ApplicationDbContext) - clear any saved-plan references first
            // so users who saved this itinerary don't keep a dangling
            // entry, and so the delete below doesn't hit an FK violation.
            // ItineraryStop cascades automatically via its own FK config.
            await _travelPlanItemRepository.DeleteByItineraryIdAsync(request.Id);

            await _itineraryRepository.DeleteAsync(itinerary);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Itinerary deleted successfully",
            };
        }
    }
}
