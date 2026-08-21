using MediatR;

namespace PaddleThroughLychnidos.Application.DayPlan.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
        public int UserId { get; set; }
    }
}
