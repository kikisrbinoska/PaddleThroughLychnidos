using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class UpdateRoleResponse
    {
        public int Id { get; set; }
        public UserRole Role { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
