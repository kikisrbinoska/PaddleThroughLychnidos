using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.User.Queries
{
    public class AdminUserListItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }

        // Populated only for Artisans who own a shop - lets the admin table
        // show shop context without a second lookup.
        public int? ShopId { get; set; }
        public string? ShopName { get; set; }
        public ShopStatus? ShopStatus { get; set; }
    }

    public class GetAllResponse
    {
        public List<AdminUserListItem> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
