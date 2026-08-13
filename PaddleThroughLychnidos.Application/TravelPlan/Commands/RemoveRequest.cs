using MediatR;

namespace PaddleThroughLychnidos.Application.TravelPlan.Commands
{
    public class RemoveRequest : IRequest<RemoveResponse>
    {
        public int Id { get; set; }
        public int UserId { get; set; }
    }
}
