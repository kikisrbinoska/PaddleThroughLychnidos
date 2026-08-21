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
    public class DayPlanRepository : GenericRepository<DayPlan>, IDayPlanRepository
    {
        public DayPlanRepository(ApplicationDbContext context) : base(context, context.DayPlans)
        {
        }

        public async Task<List<DayPlan>> GetByUserIdAsync(int userId)
        {
            return await _context.DayPlans
                .Include(p => p.Stops)
                    .ThenInclude(s => s.Shop)
                        .ThenInclude(sh => sh.Images)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.Date)
                .ThenByDescending(p => p.Id)
                .ToListAsync();
        }

        public async Task<DayPlan?> GetByIdWithStopsAsync(int id)
        {
            return await _context.DayPlans
                .Include(p => p.Stops)
                    .ThenInclude(s => s.Shop)
                        .ThenInclude(sh => sh.Images)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
