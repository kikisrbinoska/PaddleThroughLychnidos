using MediatR;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
