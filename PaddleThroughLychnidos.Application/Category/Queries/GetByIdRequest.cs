using MediatR;

namespace PaddleThroughLychnidos.Application.Category.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
