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
    public class LearnVideoRepository : GenericRepository<LearnVideo>, ILearnVideoRepository
    {
        public LearnVideoRepository(ApplicationDbContext context) : base(context, context.LearnVideos)
        {
        }

        public async Task<(int count, List<LearnVideo> list)> GetPagedAsync(int? pageNumber, int? pageSize, LearnCategory category)
        {
            var query = _context.LearnVideos
                .Where(v => v.Category == category)
                .OrderByDescending(v => v.PublishedAt)
                .AsQueryable();

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

        public async Task<LearnVideo?> GetByIdWithRelatedCategoryAsync(int id)
        {
            return await _context.LearnVideos
                .Include(v => v.RelatedCategory)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<HashSet<string>> GetExistingYoutubeVideoIdsAsync(IEnumerable<string> youtubeVideoIds)
        {
            var ids = youtubeVideoIds.ToList();
            var existing = await _context.LearnVideos
                .Where(v => ids.Contains(v.YoutubeVideoId))
                .Select(v => v.YoutubeVideoId)
                .ToListAsync();

            return existing.ToHashSet();
        }
    }
}
