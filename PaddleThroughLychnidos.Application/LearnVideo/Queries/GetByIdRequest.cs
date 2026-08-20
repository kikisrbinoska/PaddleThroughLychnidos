using MediatR;

namespace PaddleThroughLychnidos.Application.LearnVideo.Queries
{
    public class GetByIdRequest : IRequest<GetByIdResponse>
    {
        public int Id { get; set; }
    }
}
