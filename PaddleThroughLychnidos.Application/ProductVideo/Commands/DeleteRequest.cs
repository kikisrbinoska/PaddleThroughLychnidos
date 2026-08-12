using MediatR;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
