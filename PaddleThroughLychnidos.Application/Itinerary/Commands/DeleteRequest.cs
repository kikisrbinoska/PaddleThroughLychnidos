using MediatR;

namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
