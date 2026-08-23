using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IShopRepository _shopRepository;

        public DeleteHandler(IProductRepository productRepository, IShopRepository shopRepository)
        {
            _productRepository = productRepository;
            _shopRepository = shopRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Product not found", HttpStatusCode.NotFound);

            var shop = await _shopRepository.GetByIdAsync(product.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            if (shop.OwnerId != request.RequestingUserId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to delete this product", HttpStatusCode.Forbidden);
            }

            await _productRepository.DeleteAsync(product);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Product deleted successfully",
            };
        }
    }
}
