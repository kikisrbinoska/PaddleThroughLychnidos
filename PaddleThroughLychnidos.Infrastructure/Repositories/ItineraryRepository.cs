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
    public class ItineraryRepository : GenericRepository<Itinerary>, IItineraryRepository
    {
        public ItineraryRepository(ApplicationDbContext context) : base(context, context.Itineraries)
        {
        }

        public async Task<Itinerary?> GetByIdWithStopsAsync(int id)
        {
            return await _context.Itineraries
                .Include(i => i.Region)
                .Include(i => i.Stops)
                    .ThenInclude(s => s.Shop)
                        .ThenInclude(sh => sh.Images)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<(int count, List<Itinerary> list)> GetPagedAsync(int? pageNumber, int? pageSize, int? regionId)
        {
            var query = _context.Itineraries
                .Include(i => i.Region)
                .AsQueryable();

            if (regionId.HasValue)
            {
                query = query.Where(i => i.RegionId == regionId.Value);
            }

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
