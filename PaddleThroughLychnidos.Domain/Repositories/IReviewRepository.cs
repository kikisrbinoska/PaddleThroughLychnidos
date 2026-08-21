using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IReviewRepository : IRepository<Review>
    {
        public Task<Review?> GetByUserAndShopAsync(int userId, int shopId);
        public Task<(int count, List<Review> list)> GetPagedAsync(int? pageNumber, int? pageSize, int? shopId, int? userId);
    }
}
