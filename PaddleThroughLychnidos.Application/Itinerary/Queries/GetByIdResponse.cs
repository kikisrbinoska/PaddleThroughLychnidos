using PaddleThroughLychnidos.Application.Shared;

namespace PaddleThroughLychnidos.Application.Itinerary.Queries
{
    public class ItineraryStopDto
    {
        public int Order { get; set; }
        public string Notes { get; set; } = string.Empty;
        public TimeSpan SuggestedTime { get; set; }
        public ShopSummaryDto Shop { get; set; } = new();
    }

    public class ItineraryDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public int DurationHours { get; set; }
        public int RegionId { get; set; }
        public string RegionName { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public List<ItineraryStopDto> Stops { get; set; } = new();
    }

    public class GetByIdResponse
    {
        public ItineraryDetailDto Itinerary { get; set; } = new();
    }
}
