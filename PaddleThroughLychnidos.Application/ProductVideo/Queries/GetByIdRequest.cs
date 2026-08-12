using MediatR;

namespace PaddleThroughLychnidos.Application.ProductVideo.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
