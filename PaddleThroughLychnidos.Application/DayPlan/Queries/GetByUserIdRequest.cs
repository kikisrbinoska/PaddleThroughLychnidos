using MediatR;

namespace PaddleThroughLychnidos.Application.DayPlan.Queries
{
    public class GetByUserIdRequest : IRequest<GetByUserIdResponse>
    {
        public int UserId { get; set; }
    }
}
