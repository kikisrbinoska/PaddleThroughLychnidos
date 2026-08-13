using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class GetPagedHandler : IRequestHandler<GetPagedRequest, GetPagedResponse>
    {
        private readonly IProductRepository _productRepository;

        public GetPagedHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<GetPagedResponse> Handle(GetPagedRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _productRepository.GetPagedAsync(pageNumber, pageSize, request.SearchWord, request.ShopId, request.MinPrice, request.MaxPrice);

            var items = list
                .Select(product => new ProductListItem
                {
                    Id = product.Id,
                    ShopId = product.ShopId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                })
                .ToList();

            var totalPages = (int)Math.Ceiling(count / (double)pageSize);

            return new GetPagedResponse
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
