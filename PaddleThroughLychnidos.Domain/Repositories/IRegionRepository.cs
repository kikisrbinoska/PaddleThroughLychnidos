using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IRegionRepository : IRepository<Region>
    {
        public Task<int> GetShopCountAsync(int regionId);
        public Task<int> GetItineraryCountAsync(int regionId);
        public Task UnassignShopsAsync(int regionId);
    }
}
