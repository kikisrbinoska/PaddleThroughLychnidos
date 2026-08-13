using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Infrastructure.Data.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Infrastructure.Repositories
{
    public class ItineraryStopRepository : GenericRepository<ItineraryStop>, IItineraryStopRepository
    {
        public ItineraryStopRepository(ApplicationDbContext context) : base(context, context.ItineraryStops)
        {
        }
    }
}
