using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Infrastructure.Data.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PaddleThroughLychnidos.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context)
            : base(context, context.Users)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<IEnumerable<User>> GetUsersByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Users
                .Where(u => ids.Contains(u.Id))
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<int> GetCountByRoleAsync(UserRole role)
        {
            return await _context.Users.CountAsync(u => u.Role == role);
        }

        public async Task<(int count, List<User> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, UserRole? roleFilter)
        {
            var query = _context.Users
                .Include(u => u.Shops)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchWord))
            {
                var term = searchWord.Trim();
                query = query.Where(u =>
                    EF.Functions.ILike(u.Name, $"%{term}%") ||
                    EF.Functions.ILike(u.Username, $"%{term}%") ||
                    EF.Functions.ILike(u.Email, $"%{term}%"));
            }

            if (roleFilter.HasValue)
            {
                query = query.Where(u => u.Role == roleFilter.Value);
            }

            query = query.OrderByDescending(u => u.CreatedAt);

            var count = await query.CountAsync();

            if (pageNumber.HasValue && pageSize.HasValue)
            {
                query = query
                    .Skip((pageNumber.Value - 1) * pageSize.Value)
                    .Take(pageSize.Value);
            }

            var list = await query.ToListAsync();

            return (count, list);
        }
    }
}
