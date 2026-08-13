using PaddleThroughLychnidos.Application.Itinerary.Queries;
using PaddleThroughLychnidos.Application.Shared;

namespace PaddleThroughLychnidos.Application.TravelPlan.Queries
{
    public class TravelPlanItemDto
    {
        public int Id { get; set; }
        public DateTime AddedAt { get; set; }
        public ShopSummaryDto? Shop { get; set; }
        public ItineraryListDto? Itinerary { get; set; }
    }

    public class GetByUserIdResponse
    {
        public List<TravelPlanItemDto> Items { get; set; } = new();
    }
}
