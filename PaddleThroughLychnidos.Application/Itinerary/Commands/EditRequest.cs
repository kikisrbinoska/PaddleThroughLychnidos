using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class EditStopRequest
    {
        public int ShopId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public TimeSpan SuggestedTime { get; set; }
    }

    public class EditRequest : IRequest<EditResponse>
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public int DurationHours { get; set; }
        public int RegionId { get; set; }
        public ItineraryDifficulty Difficulty { get; set; }

        // Full ordered stop list - replaces the itinerary's existing stops
        // entirely on save (order in this list determines Order 1..N),
        // rather than separate add/reorder/remove endpoints.
        public List<EditStopRequest> Stops { get; set; } = new();
    }
}
