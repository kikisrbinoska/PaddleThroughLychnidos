using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface ITravelPlanItemRepository : IRepository<TravelPlanItem>
    {
        public Task<List<TravelPlanItem>> GetByUserIdAsync(int userId);
    }
}
