using MediatR;

namespace PaddleThroughLychnidos.Application.Category.Queries
{
    public class GetRequest : IRequest<List<GetResponse>>
    {
    }
}
