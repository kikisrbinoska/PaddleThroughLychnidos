using MediatR;

namespace PaddleThroughLychnidos.Application.Itinerary.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
