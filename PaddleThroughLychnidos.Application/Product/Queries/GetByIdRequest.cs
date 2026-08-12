using MediatR;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
