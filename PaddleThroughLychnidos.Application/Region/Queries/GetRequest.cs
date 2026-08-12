using MediatR;

namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetRequest : IRequest<List<GetResponse>>
    {
    }
}
