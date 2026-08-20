using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface ILearnVideoRepository : IRepository<LearnVideo>
    {
        public Task<(int count, List<LearnVideo> list)> GetPagedAsync(int? pageNumber, int? pageSize, LearnCategory category);
        public Task<LearnVideo?> GetByIdWithRelatedCategoryAsync(int id);
        public Task<HashSet<string>> GetExistingYoutubeVideoIdsAsync(IEnumerable<string> youtubeVideoIds);
    }
}
