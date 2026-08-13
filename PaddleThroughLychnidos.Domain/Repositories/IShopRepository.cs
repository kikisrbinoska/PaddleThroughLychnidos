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
    }
}
