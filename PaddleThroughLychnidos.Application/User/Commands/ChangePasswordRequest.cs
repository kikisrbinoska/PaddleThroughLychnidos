using MediatR;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class ChangePasswordRequest : IRequest<ChangePasswordResponse>
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
