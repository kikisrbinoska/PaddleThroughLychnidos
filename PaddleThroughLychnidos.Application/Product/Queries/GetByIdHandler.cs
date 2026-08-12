using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IShopRepository _shopRepository;

        public GetByIdHandler(IProductRepository productRepository, IShopRepository shopRepository)
        {
            _productRepository = productRepository;
            _shopRepository = shopRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id);
            if (product == null)
            {
                throw new PaddleThroughLychnidosException($"Product with Id {request.Id} not found.", HttpStatusCode.NotFound);
            }

            var shop = await _shopRepository.GetByIdAsync(product.ShopId);

            return new GetByIdResponse
            {
                Id = product.Id,
                ShopId = product.ShopId,
                ShopName = shop?.Name ?? "Unknown",
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
            };
        }
    }
}
