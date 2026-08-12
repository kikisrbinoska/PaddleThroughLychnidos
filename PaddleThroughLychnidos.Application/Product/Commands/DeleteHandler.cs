using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IProductRepository _productRepository;

        public DeleteHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Product not found", HttpStatusCode.NotFound);

            await _productRepository.DeleteAsync(product);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Product deleted successfully",
            };
        }
    }
}
