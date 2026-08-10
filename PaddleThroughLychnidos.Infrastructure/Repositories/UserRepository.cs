using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Infrastructure.Data.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context)
            : base(context, context.Users)
        {
        }

        public User? GetByEmail(string email)
        {
            return _context.Users.Where(u => u.Email == email).FirstOrDefault();
        }

        public User? GetByUsername(string Username)
        {
            return _context.Users.Where(u => u.Username == Username).FirstOrDefault();
        }

        public IEnumerable<User> GetUsersByIds(IEnumerable<int> ids)
        {
            return _context.Users
                .Where(u => ids.Contains(u.Id));
        }
    }
}
