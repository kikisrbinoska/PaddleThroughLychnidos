using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByUsernameAsync(string username);
        Task<IEnumerable<User>> GetUsersByIdsAsync(IEnumerable<int> ids);
        Task<int> GetTotalCountAsync();
        Task<int> GetCountByRoleAsync(UserRole role);

        /// <summary>
        /// Admin user list (GET /api/admin/users) - includes each user's
        /// Shops so the handler can surface an Artisan's shop name/status
        /// without a second round trip.
        /// </summary>
        Task<(int count, List<User> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, UserRole? roleFilter);
    }
}
