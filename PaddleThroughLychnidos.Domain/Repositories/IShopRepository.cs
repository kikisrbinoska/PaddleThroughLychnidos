using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IShopRepository : IRepository<Shop>
    {
        public Task<(int count, List<Shop> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, int? categoryId, int? regionId);
        public Task<int> GetTotalNumberAsync();
        public Task<List<Shop>> GetByIdsAsync(IEnumerable<int> ids);

        /// <summary>All shops owned by this user - an Artisan may own more than one.</summary>
        public Task<List<Shop>> GetByOwnerIdAsync(int ownerId);

        /// <summary>
        /// Same as GetByIdAsync, but eager-loads Region/Category/Images -
        /// used wherever the caller needs to read those navigation
        /// properties (e.g. building an OwnedShopDto), since GetByIdAsync
        /// goes through EF's FindAsync and does not include them.
        /// </summary>
        public Task<Shop?> GetByIdWithDetailsAsync(int id);
        public Task<List<Shop>> GetPendingAsync();
        public Task<int> GetSavedCountAsync(int shopId);
        public Task<int> GetCountByStatusAsync(ShopStatus status);
        public Task<int> GetVerifiedCountAsync();

        /// <summary>Used by Region.Comands.BackfillShopRegionsCommand to find shops still missing a RegionId.</summary>
        public Task<List<Shop>> GetWithoutRegionAsync();
    }
}
