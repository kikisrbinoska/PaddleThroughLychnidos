using MediatR;
using PaddleThroughLychnidos.Application.Shared;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Itinerary.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly IItineraryRepository _itineraryRepository;

        public GetByIdHandler(IItineraryRepository itineraryRepository)
        {
            _itineraryRepository = itineraryRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var itinerary = await _itineraryRepository.GetByIdWithStopsAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException($"Itinerary with Id {request.Id} not found.", HttpStatusCode.NotFound);

            var dto = new ItineraryDetailDto
            {
                Id = itinerary.Id,
                Title = itinerary.Title,
                Description = itinerary.Description,
                CoverImageUrl = itinerary.CoverImageUrl,
                DurationHours = itinerary.DurationHours,
                RegionId = itinerary.RegionId,
                RegionName = itinerary.Region?.Name ?? "Unknown",
                Difficulty = itinerary.Difficulty.ToString(),
                Stops = itinerary.Stops
                    .OrderBy(s => s.Order)
                    .Select(s => new ItineraryStopDto
                    {
                        Order = s.Order,
                        Notes = s.Notes,
                        SuggestedTime = s.SuggestedTime,
                        Shop = new ShopSummaryDto
                        {
                            Id = s.Shop.Id,
                            Name = s.Shop.Name,
                            Latitude = s.Shop.Latitude,
                            Longitude = s.Shop.Longitude,
                            ImageUrl = s.Shop.Images.FirstOrDefault()?.Url ?? string.Empty,
                        },
                    })
                    .ToList(),
            };

            return new GetByIdResponse { Itinerary = dto };
        }
    }
}
