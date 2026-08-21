using MediatR;

namespace PaddleThroughLychnidos.Application.DayPlan.Commands
{
    public class CreateRequest : IRequest<CreateResponse>
    {
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateOnly Date { get; set; }

        /// <summary>Shop ids in the order they should appear in the plan. Must all be shops already saved to the user's travel plan.</summary>
        public List<int> ShopIds { get; set; } = new();
    }
}
