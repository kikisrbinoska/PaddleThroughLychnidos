using MediatR;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
