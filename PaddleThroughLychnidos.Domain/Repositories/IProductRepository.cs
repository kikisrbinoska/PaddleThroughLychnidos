using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        public Task<(int count, List<Product> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, string? tag);
        public Task<int> GetTotalNumberAsync();
    }
}
