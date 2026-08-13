using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class CreateHandler : IRequestHandler<CreateRequest, CreateResponse>
    {
        private readonly IItineraryRepository _itineraryRepository;
        private readonly IRegionRepository _regionRepository;
        private readonly IShopRepository _shopRepository;

        public CreateHandler(
            IItineraryRepository itineraryRepository,
            IRegionRepository regionRepository,
            IShopRepository shopRepository)
        {
            _itineraryRepository = itineraryRepository;
            _regionRepository = regionRepository;
            _shopRepository = shopRepository;
        }

        public async Task<CreateResponse> Handle(CreateRequest request, CancellationToken cancellationToken)
        {
            _ = await _regionRepository.GetByIdAsync(request.RegionId)
                ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);

            foreach (var stopRequest in request.Stops)
            {
                _ = await _shopRepository.GetByIdAsync(stopRequest.ShopId)
                    ?? throw new PaddleThroughLychnidosException($"Shop with Id {stopRequest.ShopId} not found", HttpStatusCode.NotFound);
            }

            var itinerary = new Domain.Entities.Itinerary
            {
                Title = request.Title,
                Description = request.Description,
                CoverImageUrl = request.CoverImageUrl,
                DurationHours = request.DurationHours,
                RegionId = request.RegionId,
                Difficulty = request.Difficulty,
                Stops = request.Stops
                    .Select((stopRequest, index) => new Domain.Entities.ItineraryStop
                    {
                        ShopId = stopRequest.ShopId,
                        Order = index + 1,
                        Notes = stopRequest.Notes,
                        SuggestedTime = stopRequest.SuggestedTime,
                    })
                    .ToList(),
            };

            await _itineraryRepository.AddAsync(itinerary);

            return new CreateResponse
            {
                Id = itinerary.Id,
                Title = itinerary.Title,
                Description = itinerary.Description,
                CoverImageUrl = itinerary.CoverImageUrl,
                DurationHours = itinerary.DurationHours,
                RegionId = itinerary.RegionId,
                Difficulty = itinerary.Difficulty.ToString(),
                Stops = itinerary.Stops
                    .OrderBy(s => s.Order)
                    .Select(s => new CreateStopResponse
                    {
                        ShopId = s.ShopId,
                        Order = s.Order,
                        Notes = s.Notes,
                        SuggestedTime = s.SuggestedTime,
                    })
                    .ToList(),
                Message = "Itinerary created successfully",
            };
        }
    }
}
