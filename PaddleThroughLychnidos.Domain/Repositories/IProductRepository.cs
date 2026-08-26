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
        public Task<(int count, List<Product> list)> GetPagedAsync(int? pageNumber, int? pageSize, string? searchWord, int? shopId, decimal? minPrice, decimal? maxPrice);

        /// <summary>
        /// Marketplace-wide browsing (GET /api/products) - includes Shop
        /// for shop-context display and, unlike GetPagedAsync above, only
        /// returns products whose shop is publicly visible
        /// (ShopStatus.Approved), matching how GET /api/shops already
        /// hides Pending/Rejected shops from tourists.
        /// </summary>
        public Task<(int count, List<Product> list)> GetPagedForMarketplaceAsync(
            int? pageNumber,
            int? pageSize,
            string? searchWord,
            int? categoryId,
            int? regionId,
            decimal? minPrice,
            decimal? maxPrice);

        public Task<int> GetTotalNumberAsync();

        /// <summary>Used by Product.Commands.AddHandler to enforce the Free-tier product cap.</summary>
        public Task<int> GetCountByShopAsync(int shopId);
    }
}
