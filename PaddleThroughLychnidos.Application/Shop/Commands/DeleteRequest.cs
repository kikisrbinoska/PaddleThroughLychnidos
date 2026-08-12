using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
