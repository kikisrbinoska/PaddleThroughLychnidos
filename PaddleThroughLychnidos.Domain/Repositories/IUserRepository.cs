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
        public User? GetByEmail(string Email);
        public User? GetByUsername(string Username);
        public IEnumerable<User> GetUsersByIds(IEnumerable<int> ids);
    }
}
