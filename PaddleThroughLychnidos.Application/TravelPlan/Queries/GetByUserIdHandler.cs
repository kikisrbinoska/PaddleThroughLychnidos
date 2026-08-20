using MediatR;
using PaddleThroughLychnidos.Application.Itinerary.Queries;
using PaddleThroughLychnidos.Application.Shared;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.TravelPlan.Queries
{
    public class GetByUserIdHandler : IRequestHandler<GetByUserIdRequest, GetByUserIdResponse>
    {
        private readonly ITravelPlanItemRepository _travelPlanItemRepository;

        public GetByUserIdHandler(ITravelPlanItemRepository travelPlanItemRepository)
        {
            _travelPlanItemRepository = travelPlanItemRepository;
        }

        public async Task<GetByUserIdResponse> Handle(GetByUserIdRequest request, CancellationToken cancellationToken)
        {
            var items = await _travelPlanItemRepository.GetByUserIdAsync(request.UserId);

            var dtos = items
                .Select(item => new TravelPlanItemDto
                {
                    Id = item.Id,
                    AddedAt = item.AddedAt,
                    Shop = item.Shop == null ? null : new ShopSummaryDto
                    {
                        Id = item.Shop.Id,
                        Name = item.Shop.Name,
                        Latitude = item.Shop.Latitude,
                        Longitude = item.Shop.Longitude,
                        ImageUrl = item.Shop.Images.FirstOrDefault()?.Url ?? string.Empty,
                    },
                    Itinerary = item.Itinerary == null ? null : new ItineraryListDto
                    {
                        Id = item.Itinerary.Id,
                        Title = item.Itinerary.Title,
                        CoverImageUrl = item.Itinerary.CoverImageUrl,
                        DurationHours = item.Itinerary.DurationHours,
                        RegionName = item.Itinerary.Region?.Name ?? "Unknown",
                        Difficulty = item.Itinerary.Difficulty.ToString(),
                        Description = item.Itinerary.Description,
                        StopCount = item.Itinerary.Stops.Count,
                    },
                })
                .ToList();

            return new GetByUserIdResponse { Items = dtos };
        }
    }
}
