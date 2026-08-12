using MediatR;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class EditRequest : IRequest<EditResponse>
    {
        public int Id { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
    }
}
