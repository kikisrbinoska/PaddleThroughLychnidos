using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface INewsItemRepository : IRepository<NewsItem>
    {
        public Task<(int count, List<NewsItem> list)> GetPagedAsync(int? pageNumber, int? pageSize, NewsCategory? category);
        public Task<HashSet<string>> GetExistingSourceUrlsAsync(IEnumerable<string> sourceUrls);
    }
}
