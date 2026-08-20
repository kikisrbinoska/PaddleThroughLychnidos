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
    public class NewsItemRepository : GenericRepository<NewsItem>, INewsItemRepository
    {
        public NewsItemRepository(ApplicationDbContext context) : base(context, context.NewsItems)
        {
        }

        public async Task<(int count, List<NewsItem> list)> GetPagedAsync(int? pageNumber, int? pageSize, NewsCategory? category)
        {
            var query = _context.NewsItems.AsQueryable();

            if (category.HasValue)
            {
                query = query.Where(n => n.Category == category.Value);
            }

            // PublishedAt alone isn't unique (multiple articles can share a
            // timestamp, especially the DateTime.UtcNow fallback used when a
            // scraper can't parse a date - see NewsScraperJob), so paging by
            // it alone isn't stable: the same row can land on two different
            // pages between requests. Id as a tiebreaker makes the order
            // deterministic.
            query = query
                .OrderByDescending(n => n.PublishedAt)
                .ThenByDescending(n => n.Id);

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

        public async Task<HashSet<string>> GetExistingSourceUrlsAsync(IEnumerable<string> sourceUrls)
        {
            var urls = sourceUrls.ToList();
            var existing = await _context.NewsItems
                .Where(n => urls.Contains(n.SourceUrl))
                .Select(n => n.SourceUrl)
                .ToListAsync();

            return existing.ToHashSet();
        }
    }
}
