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

        public async Task<(int count, List<Product> list)> GetPagedForMarketplaceAsync(
            int? pageNumber,
            int? pageSize,
            string? searchWord,
            int? categoryId,
            int? regionId,
            decimal? minPrice,
            decimal? maxPrice)
        {
            var query = _context.Products
                .Include(p => p.Shop)
                .Where(p => p.Shop.Status == ShopStatus.Approved)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchWord))
            {
                var term = searchWord.Trim();
                query = query.Where(p =>
                    EF.Functions.ILike(p.Name, $"%{term}%") ||
                    EF.Functions.ILike(p.Description, $"%{term}%"));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.Shop.CategoryId == categoryId.Value);
            }

            if (regionId.HasValue)
            {
                query = query.Where(p => p.Shop.RegionId == regionId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // No natural "latest" field on Product to sort by - Id gives a
            // stable, deterministic order across pages (see
            // NewsItemRepository.GetPagedAsync for why an unordered or
            // non-unique sort key breaks pagination).
            query = query.OrderByDescending(p => p.Id);

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

        public async Task<int> GetCountByShopAsync(int shopId)
        {
            return await _context.Products.CountAsync(p => p.ShopId == shopId);
        }
    }
}
