using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class GetMarketplaceHandler : IRequestHandler<GetMarketplaceRequest, GetMarketplaceResponse>
    {
        private readonly IProductRepository _productRepository;

        public GetMarketplaceHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<GetMarketplaceResponse> Handle(GetMarketplaceRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _productRepository.GetPagedForMarketplaceAsync(
                pageNumber,
                pageSize,
                request.Search,
                request.CategoryId,
                request.RegionId,
                request.MinPrice,
                request.MaxPrice);

            var items = list
                .Select(product => new MarketplaceProductListItem
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                    ShopId = product.ShopId,
                    ShopName = product.Shop.Name,
                    ShopIsVerified = product.Shop.IsVerified,
                })
                .ToList();

            var totalPages = (int)Math.Ceiling(count / (double)pageSize);

            return new GetMarketplaceResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
