using MediatR;

namespace PaddleThroughLychnidos.Application.User.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
