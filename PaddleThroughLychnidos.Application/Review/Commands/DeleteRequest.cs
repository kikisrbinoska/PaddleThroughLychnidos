using MediatR;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
