using MediatR;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class EditRequest : IRequest<EditResponse>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
