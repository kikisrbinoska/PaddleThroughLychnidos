using Microsoft.EntityFrameworkCore;
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
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(ApplicationDbContext context) : base(context, context.Reviews)
        {

        }

        public async Task<Review?> GetByUserAndShopAsync(int userId, int shopId)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ShopId == shopId);
        }

        public async Task<(int count, List<Review> list)> GetPagedAsync(int? pageNumber, int? pageSize, int? shopId, int? userId)
        {
            var query = _context.Reviews.AsQueryable();

            if (shopId.HasValue)
            {
                query = query.Where(r => r.ShopId == shopId.Value);
            }

            if (userId.HasValue)
            {
                query = query.Where(r => r.UserId == userId.Value);
            }

            query = query
                .OrderByDescending(r => r.CreatedAt)
                .ThenByDescending(r => r.Id);

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
