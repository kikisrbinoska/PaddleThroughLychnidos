using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IProductVideoRepository _productVideoRepository;

        public EditHandler(IProductVideoRepository productVideoRepository)
        {
            _productVideoRepository = productVideoRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var productVideo = await _productVideoRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Product video not found", HttpStatusCode.NotFound);

            productVideo.VideoUrl = request.VideoUrl;

            await _productVideoRepository.UpdateAsync(productVideo);

            return new EditResponse
            {
                Id = productVideo.Id,
                ProductId = productVideo.ProductId,
                VideoUrl = productVideo.VideoUrl,
                Message = "Product video updated successfully",
            };
        }
    }
}
