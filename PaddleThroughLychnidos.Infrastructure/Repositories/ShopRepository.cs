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

        public async Task<(int count, List<Shop> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, int? categoryId, int? regionId)
        {
            var query = _context.Shops
                .Include(s => s.Region)
                .Include(s => s.Category)
                .Include(s => s.Images)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchWord))
            {
                var term = searchWord.Trim();
                query = query.Where(s =>
                    EF.Functions.ILike(s.Name, $"%{term}%") ||
                    EF.Functions.ILike(s.Description, $"%{term}%"));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(s => s.CategoryId == categoryId.Value);
            }

            if (regionId.HasValue)
            {
                query = query.Where(s => s.RegionId == regionId.Value);
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
