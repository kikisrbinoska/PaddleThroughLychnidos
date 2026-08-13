using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.TravelPlan.Commands
{
    public class RemoveHandler : IRequestHandler<RemoveRequest, RemoveResponse>
    {
        private readonly ITravelPlanItemRepository _travelPlanItemRepository;

        public RemoveHandler(ITravelPlanItemRepository travelPlanItemRepository)
        {
            _travelPlanItemRepository = travelPlanItemRepository;
        }

        public async Task<RemoveResponse> Handle(RemoveRequest request, CancellationToken cancellationToken)
        {
            var item = await _travelPlanItemRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Travel plan item not found", HttpStatusCode.NotFound);

            if (item.UserId != request.UserId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to remove this travel plan item", HttpStatusCode.Forbidden);
            }

            await _travelPlanItemRepository.DeleteAsync(item);

            return new RemoveResponse
            {
                Id = request.Id,
                Message = "Removed from travel plan successfully",
            };
        }
    }
}
