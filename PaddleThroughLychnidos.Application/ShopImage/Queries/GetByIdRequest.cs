using MediatR;

namespace PaddleThroughLychnidos.Application.ShopImage.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
