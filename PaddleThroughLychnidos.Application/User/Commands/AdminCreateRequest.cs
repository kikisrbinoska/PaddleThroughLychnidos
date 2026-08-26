using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    /// <summary>
    /// Admin-only account creation (POST /api/admin/users) - unlike
    /// User.Commands.AddRequest (self-registration, always RegularUser),
    /// this lets an admin directly create an account of any role, including
    /// pre-created Artisan or Administrator accounts.
    /// </summary>
    public class AdminCreateRequest : IRequest<AdminCreateResponse>
    {
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }
}
