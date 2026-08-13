using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.Itinerary.Queries
{
    public class ItineraryListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public int DurationHours { get; set; }
        public string RegionName { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
    }

    public class GetPagedResponse
    {
        public List<ItineraryListDto> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
