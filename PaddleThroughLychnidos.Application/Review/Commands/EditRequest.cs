using MediatR;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class EditRequest : IRequest<EditResponse>
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}
