using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
