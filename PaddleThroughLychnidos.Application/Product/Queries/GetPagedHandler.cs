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
            var (count, list) = await _productRepository.GetPagedAsync(request.PageNumber, request.PageSize, request.SearchWord, request.Tag);

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

            var pageSize = request.PageSize;
            var totalPages = pageSize.HasValue && pageSize.Value > 0
                ? (int)Math.Ceiling(count / (double)pageSize.Value)
                : 1;

            return new GetPagedResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
