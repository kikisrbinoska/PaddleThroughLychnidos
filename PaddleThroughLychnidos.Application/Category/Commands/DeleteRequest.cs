using MediatR;

namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
