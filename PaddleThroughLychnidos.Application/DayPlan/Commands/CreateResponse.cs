namespace PaddleThroughLychnidos.Application.DayPlan.Commands
{
    public class CreateStopResponse
    {
        public int ShopId { get; set; }
        public string ShopName { get; set; } = string.Empty;
        public int Order { get; set; }
    }

    public class CreateResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public List<CreateStopResponse> Stops { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }
}
