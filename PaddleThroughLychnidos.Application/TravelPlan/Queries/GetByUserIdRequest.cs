using MediatR;

namespace PaddleThroughLychnidos.Application.TravelPlan.Queries
{
    public class GetByUserIdRequest : IRequest<GetByUserIdResponse>
    {
        public int UserId { get; set; }
    }
}
