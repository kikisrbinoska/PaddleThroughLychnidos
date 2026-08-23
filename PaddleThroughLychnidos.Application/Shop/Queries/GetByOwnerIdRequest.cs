using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetByOwnerIdRequest : IRequest<GetByOwnerIdResponse>
    {
        public int OwnerId { get; set; }
    }
}
