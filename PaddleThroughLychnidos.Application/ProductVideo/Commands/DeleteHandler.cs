using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IProductVideoRepository _productVideoRepository;

        public DeleteHandler(IProductVideoRepository productVideoRepository)
        {
            _productVideoRepository = productVideoRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var productVideo = await _productVideoRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Product video not found", HttpStatusCode.NotFound);

            await _productVideoRepository.DeleteAsync(productVideo);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Product video deleted successfully",
            };
        }
    }
}
