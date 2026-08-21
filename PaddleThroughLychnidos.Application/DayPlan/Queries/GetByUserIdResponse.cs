using PaddleThroughLychnidos.Application.Shared;

namespace PaddleThroughLychnidos.Application.DayPlan.Queries
{
    public class DayPlanStopDto
    {
        public int Order { get; set; }
        public ShopSummaryDto Shop { get; set; } = new();
    }

    public class DayPlanDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public List<DayPlanStopDto> Stops { get; set; } = new();
    }

    public class GetByUserIdResponse
    {
        public List<DayPlanDto> Plans { get; set; } = new();
    }
}
