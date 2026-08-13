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
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context, context.Products)
        {
        }

        public async Task<(int count, List<Product> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, int? shopId, decimal? minPrice, decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchWord))
            {
                var term = searchWord.Trim();
                query = query.Where(p =>
                    EF.Functions.ILike(p.Name, $"%{term}%") ||
                    EF.Functions.ILike(p.Description, $"%{term}%"));
            }

            if (shopId.HasValue)
            {
                query = query.Where(p => p.ShopId == shopId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
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
            return await _context.Products.CountAsync();
        }
    }
}
