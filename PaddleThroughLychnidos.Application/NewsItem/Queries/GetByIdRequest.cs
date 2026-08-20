using MediatR;

namespace PaddleThroughLychnidos.Application.NewsItem.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
