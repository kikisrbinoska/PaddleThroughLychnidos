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
        public Task<Shop?> GetByOwnerIdAsync(int ownerId);
        public Task<List<Shop>> GetPendingAsync();
        public Task<int> GetSavedCountAsync(int shopId);
        public Task<int> GetCountByStatusAsync(ShopStatus status);
        public Task<int> GetVerifiedCountAsync();
    }
}
