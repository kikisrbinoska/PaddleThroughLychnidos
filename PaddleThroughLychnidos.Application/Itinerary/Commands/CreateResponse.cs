namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class CreateStopResponse
    {
        public int ShopId { get; set; }
        public int Order { get; set; }
        public string Notes { get; set; } = string.Empty;
        public TimeSpan SuggestedTime { get; set; }
    }

    public class CreateResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public int DurationHours { get; set; }
        public int RegionId { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public List<CreateStopResponse> Stops { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }
}
