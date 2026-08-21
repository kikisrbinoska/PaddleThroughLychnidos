using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IDayPlanRepository : IRepository<DayPlan>
    {
        public Task<List<DayPlan>> GetByUserIdAsync(int userId);
        public Task<DayPlan?> GetByIdWithStopsAsync(int id);
    }
}
