using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class AdminCreateResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
