using MediatR;

namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetForAdminRequest : IRequest<List<GetForAdminResponse>>
    {
    }
}
