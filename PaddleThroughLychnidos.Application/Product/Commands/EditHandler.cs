using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IShopRepository _shopRepository;

        public EditHandler(IProductRepository productRepository, IShopRepository shopRepository)
        {
            _productRepository = productRepository;
            _shopRepository = shopRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Product not found", HttpStatusCode.NotFound);

            var shop = await _shopRepository.GetByIdAsync(product.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            if (shop.OwnerId != request.RequestingUserId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to edit this product", HttpStatusCode.Forbidden);
            }

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.ImageUrl = request.ImageUrl;

            await _productRepository.UpdateAsync(product);

            return new EditResponse
            {
                Id = product.Id,
                ShopId = product.ShopId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Message = "Product updated successfully",
            };
        }
    }
}
