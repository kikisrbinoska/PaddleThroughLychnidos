using MediatR;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class LoginRequest : IRequest<LoginResponse>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
