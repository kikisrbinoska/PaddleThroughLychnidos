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
    public class ShopRepository : GenericRepository<Shop>, IShopRepository
    {
        public ShopRepository(ApplicationDbContext context) : base(context, context.Shops)
        {
        }

        public async Task<(int count, List<Shop> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, string? tag)
        {
            var query = _context.Shops.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchWord))
            {
                query = query.Where(s =>
                    s.Name.Contains(searchWord) ||
                    s.Description.Contains(searchWord));
            }

            if (!string.IsNullOrWhiteSpace(tag))
            {
                query = query.Where(s => s.Category.Name == tag);
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

        public async Task<int> GetTotalNumberAsync()
        {
            return await _context.Shops.CountAsync();
        }
    }
}
