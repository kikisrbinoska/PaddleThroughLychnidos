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
                // Public/tourist-facing listing - Pending and Rejected
                // artisan shops stay invisible here until an admin
                // approves them. Artisans see their own shop regardless of
                // status via GET /api/artisan/my-shop instead.
                .Where(s => s.Status == ShopStatus.Approved)
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

        public async Task<List<Shop>> GetByIdsAsync(IEnumerable<int> ids)
        {
            var idList = ids.ToList();
            return await _context.Shops
                .Where(s => idList.Contains(s.Id))
                .ToListAsync();
        }

        public async Task<Shop?> GetByOwnerIdAsync(int ownerId)
        {
            return await _context.Shops
                .Include(s => s.Region)
                .Include(s => s.Category)
                .Include(s => s.Images)
                // The UI currently designs for one shop per artisan (see
                // task notes) - if an owner ever has more than one, this
                // deterministically picks the most recently created.
                .Where(s => s.OwnerId == ownerId)
                .OrderByDescending(s => s.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Shop>> GetPendingAsync()
        {
            return await _context.Shops
                .Include(s => s.Region)
                .Include(s => s.Category)
                .Include(s => s.Owner)
                .Where(s => s.Status == ShopStatus.Pending)
                .OrderByDescending(s => s.CreatedAt)
                .ThenByDescending(s => s.Id)
                .ToListAsync();
        }

        public async Task<int> GetSavedCountAsync(int shopId)
        {
            return await _context.TravelPlanItems.CountAsync(t => t.ShopId == shopId);
        }

        public async Task<int> GetCountByStatusAsync(ShopStatus status)
        {
            return await _context.Shops.CountAsync(s => s.Status == status);
        }

        public async Task<int> GetVerifiedCountAsync()
        {
            return await _context.Shops.CountAsync(s => s.IsVerified);
        }
    }
}
