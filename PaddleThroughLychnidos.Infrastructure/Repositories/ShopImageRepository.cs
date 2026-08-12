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
    public class ShopImageRepository : GenericRepository<ShopImage>, IShopImageRepository
    {
        public ShopImageRepository(ApplicationDbContext context) : base(context, context.ShopImages)
        {

        }
    }
}   
