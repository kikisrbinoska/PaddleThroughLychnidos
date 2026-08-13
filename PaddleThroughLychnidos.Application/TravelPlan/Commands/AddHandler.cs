using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.TravelPlan.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly ITravelPlanItemRepository _travelPlanItemRepository;
        private readonly IUserRepository _userRepository;
        private readonly IShopRepository _shopRepository;
        private readonly IItineraryRepository _itineraryRepository;

        public AddHandler(
            ITravelPlanItemRepository travelPlanItemRepository,
            IUserRepository userRepository,
            IShopRepository shopRepository,
            IItineraryRepository itineraryRepository)
        {
            _travelPlanItemRepository = travelPlanItemRepository;
            _userRepository = userRepository;
            _shopRepository = shopRepository;
            _itineraryRepository = itineraryRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            _ = await _userRepository.GetByIdAsync(request.UserId)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            if (request.ShopId.HasValue)
            {
                _ = await _shopRepository.GetByIdAsync(request.ShopId.Value)
                    ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);
            }

            if (request.ItineraryId.HasValue)
            {
                _ = await _itineraryRepository.GetByIdAsync(request.ItineraryId.Value)
                    ?? throw new PaddleThroughLychnidosException("Itinerary not found", HttpStatusCode.NotFound);
            }

            var item = new Domain.Entities.TravelPlanItem
            {
                UserId = request.UserId,
                ShopId = request.ShopId,
                ItineraryId = request.ItineraryId,
                AddedAt = DateTime.UtcNow,
            };

            await _travelPlanItemRepository.AddAsync(item);

            return new AddResponse
            {
                Id = item.Id,
                UserId = item.UserId,
                ShopId = item.ShopId,
                ItineraryId = item.ItineraryId,
                AddedAt = item.AddedAt,
                Message = "Added to travel plan successfully",
            };
        }
    }
}
