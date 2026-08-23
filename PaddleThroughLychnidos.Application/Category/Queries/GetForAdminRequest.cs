using MediatR;

namespace PaddleThroughLychnidos.Application.Category.Queries
{
    public class GetForAdminRequest : IRequest<List<GetForAdminResponse>>
    {
    }
}
