using MediatR;

namespace PaddleThroughLychnidos.Application.User.Queries
{
    public class GetRequest : IRequest<List<GetResponse>>
    {
    }
}
