using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IItineraryRepository : IRepository<Itinerary>
    {
        public Task<Itinerary?> GetByIdWithStopsAsync(int id);
        public Task<(int count, List<Itinerary> list)> GetPagedAsync(int? pageNumber, int? pageSize, int? regionId);
    }
}
