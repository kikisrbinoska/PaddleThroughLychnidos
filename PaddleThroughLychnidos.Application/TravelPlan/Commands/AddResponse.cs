namespace PaddleThroughLychnidos.Application.TravelPlan.Commands
{
    public class AddResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? ShopId { get; set; }
        public int? ItineraryId { get; set; }
        public DateTime AddedAt { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
