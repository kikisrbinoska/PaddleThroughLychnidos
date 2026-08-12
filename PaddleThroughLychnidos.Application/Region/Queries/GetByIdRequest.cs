using MediatR;

namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
