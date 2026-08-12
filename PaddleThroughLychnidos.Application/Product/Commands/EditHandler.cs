using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IProductRepository _productRepository;

        public EditHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Product not found", HttpStatusCode.NotFound);

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
