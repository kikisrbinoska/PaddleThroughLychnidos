using MediatR;

namespace PaddleThroughLychnidos.Application.Passport.Queries
{
    public class GetByUserIdRequest : IRequest<GetByUserIdResponse>
    {
        public int UserId { get; set; }
    }
}
