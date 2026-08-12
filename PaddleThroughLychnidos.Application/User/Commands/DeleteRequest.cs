using MediatR;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
