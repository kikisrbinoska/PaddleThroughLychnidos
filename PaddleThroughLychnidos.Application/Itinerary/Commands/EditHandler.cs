using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IItineraryRepository _itineraryRepository;
        private readonly IItineraryStopRepository _itineraryStopRepository;
        private readonly IRegionRepository _regionRepository;
        private readonly IShopRepository _shopRepository;

        public EditHandler(
            IItineraryRepository itineraryRepository,
            IItineraryStopRepository itineraryStopRepository,
            IRegionRepository regionRepository,
            IShopRepository shopRepository)
        {
            _itineraryRepository = itineraryRepository;
            _itineraryStopRepository = itineraryStopRepository;
            _regionRepository = regionRepository;
            _shopRepository = shopRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var itinerary = await _itineraryRepository.GetByIdWithStopsAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Itinerary not found", HttpStatusCode.NotFound);

            _ = await _regionRepository.GetByIdAsync(request.RegionId)
                ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);

            foreach (var stopRequest in request.Stops)
            {
                _ = await _shopRepository.GetByIdAsync(stopRequest.ShopId)
                    ?? throw new PaddleThroughLychnidosException($"Shop with Id {stopRequest.ShopId} not found", HttpStatusCode.NotFound);
            }

            itinerary.Title = request.Title;
            itinerary.Description = request.Description;
            itinerary.CoverImageUrl = request.CoverImageUrl;
            itinerary.DurationHours = request.DurationHours;
            itinerary.RegionId = request.RegionId;
            itinerary.Difficulty = request.Difficulty;

            await _itineraryRepository.UpdateAsync(itinerary);

            // Stops are fully replaced on every save (see EditRequest) -
            // delete the old set first so the (ItineraryId, Order) unique
            // index doesn't collide with the new set being added below.
            await _itineraryStopRepository.DeleteByItineraryIdAsync(itinerary.Id);

            var newStops = request.Stops
                .Select((stopRequest, index) => new Domain.Entities.ItineraryStop
                {
                    ItineraryId = itinerary.Id,
                    ShopId = stopRequest.ShopId,
                    Order = index + 1,
                    Notes = stopRequest.Notes,
                    SuggestedTime = stopRequest.SuggestedTime,
                })
                .ToList();

            foreach (var stop in newStops)
            {
                await _itineraryStopRepository.AddAsync(stop);
            }

            return new EditResponse
            {
                Id = itinerary.Id,
                Title = itinerary.Title,
                Description = itinerary.Description,
                CoverImageUrl = itinerary.CoverImageUrl,
                DurationHours = itinerary.DurationHours,
                RegionId = itinerary.RegionId,
                Difficulty = itinerary.Difficulty.ToString(),
                Stops = newStops
                    .Select(s => new EditStopResponse
                    {
                        ShopId = s.ShopId,
                        Order = s.Order,
                        Notes = s.Notes,
                        SuggestedTime = s.SuggestedTime,
                    })
                    .ToList(),
                Message = "Itinerary updated successfully",
            };
        }
    }
}
