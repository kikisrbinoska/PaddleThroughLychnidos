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
    public class TravelPlanItemRepository : GenericRepository<TravelPlanItem>, ITravelPlanItemRepository
    {
        public TravelPlanItemRepository(ApplicationDbContext context) : base(context, context.TravelPlanItems)
        {
        }

        public async Task<List<TravelPlanItem>> GetByUserIdAsync(int userId)
        {
            return await _context.TravelPlanItems
                .Include(t => t.Shop)
                    .ThenInclude(s => s!.Images)
                .Include(t => t.Itinerary)
                    .ThenInclude(i => i!.Region)
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }
    }
}
