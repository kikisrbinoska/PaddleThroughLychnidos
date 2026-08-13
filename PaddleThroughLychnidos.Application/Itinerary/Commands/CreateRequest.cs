using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class CreateStopRequest
    {
        public int ShopId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public TimeSpan SuggestedTime { get; set; }
    }

    public class CreateRequest : IRequest<CreateResponse>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public int DurationHours { get; set; }
        public int RegionId { get; set; }
        public ItineraryDifficulty Difficulty { get; set; }
        public List<CreateStopRequest> Stops { get; set; } = new();
    }
}
