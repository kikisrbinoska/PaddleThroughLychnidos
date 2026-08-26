using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.User.Queries
{
    /// <summary>Admin user list (GET /api/admin/users) - paginated, with optional search and role filter.</summary>
    public class GetAllRequest : IRequest<GetAllResponse>
    {
        /// <summary>Page number to return (1-based). Defaults to 1.</summary>
        public int? PageNumber { get; set; }

        /// <summary>Number of items per page. Defaults to 20.</summary>
        public int? PageSize { get; set; }

        /// <summary>Free-text search matched case-insensitively against Name, Username and Email (partial match).</summary>
        public string? Search { get; set; }

        /// <summary>Filters by exact role.</summary>
        public UserRole? RoleFilter { get; set; }
    }
}
