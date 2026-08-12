using MediatR;

namespace PaddleThroughLychnidos.Application.Review.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
