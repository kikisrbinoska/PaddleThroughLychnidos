using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly IProductVideoRepository _productVideoRepository;
        private readonly IProductRepository _productRepository;

        public AddHandler(IProductVideoRepository productVideoRepository, IProductRepository productRepository)
        {
            _productVideoRepository = productVideoRepository;
            _productRepository = productRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            _ = await _productRepository.GetByIdAsync(request.ProductId)
                ?? throw new PaddleThroughLychnidosException("Product not found", HttpStatusCode.NotFound);

            var productVideo = new Domain.Entities.ProductVideo
            {
                ProductId = request.ProductId,
                VideoUrl = request.VideoUrl,
            };

            await _productVideoRepository.AddAsync(productVideo);

            return new AddResponse
            {
                Id = productVideo.Id,
                ProductId = productVideo.ProductId,
                VideoUrl = productVideo.VideoUrl,
                Message = "Product video created successfully",
            };
        }
    }
}
