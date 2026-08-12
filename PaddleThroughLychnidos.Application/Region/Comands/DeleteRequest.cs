using MediatR;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
