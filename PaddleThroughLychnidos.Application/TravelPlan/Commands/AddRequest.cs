using MediatR;

namespace PaddleThroughLychnidos.Application.TravelPlan.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public int UserId { get; set; }
        public int? ShopId { get; set; }
        public int? ItineraryId { get; set; }
    }
}
