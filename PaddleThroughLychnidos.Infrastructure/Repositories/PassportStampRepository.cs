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
    public class PassportStampRepository : GenericRepository<PassportStamp>, IPassportStampRepository
    {
        public PassportStampRepository(ApplicationDbContext context) : base(context, context.PassportStamps)
        {
        }

        public async Task<PassportStamp?> GetByUserAndShopAsync(int userId, int shopId)
        {
            return await _context.PassportStamps
                .FirstOrDefaultAsync(s => s.UserId == userId && s.ShopId == shopId);
        }

        public async Task<List<PassportStamp>> GetByUserIdAsync(int userId)
        {
            return await _context.PassportStamps
                .Include(s => s.Shop)
                    .ThenInclude(sh => sh.Category)
                .Include(s => s.Shop)
                    .ThenInclude(sh => sh.Region)
                .Include(s => s.Shop)
                    .ThenInclude(sh => sh.Images)
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.VisitedAt)
                .ThenByDescending(s => s.Id)
                .ToListAsync();
        }
    }
}
