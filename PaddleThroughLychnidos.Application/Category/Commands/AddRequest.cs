using MediatR;

namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public string Name { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
    }
}
