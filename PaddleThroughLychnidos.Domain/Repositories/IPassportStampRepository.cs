using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IPassportStampRepository : IRepository<PassportStamp>
    {
        public Task<PassportStamp?> GetByUserAndShopAsync(int userId, int shopId);
        public Task<List<PassportStamp>> GetByUserIdAsync(int userId);
    }
}
