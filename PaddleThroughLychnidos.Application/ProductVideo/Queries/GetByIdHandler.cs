using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ProductVideo.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly IProductVideoRepository _productVideoRepository;

        public GetByIdHandler(IProductVideoRepository productVideoRepository)
        {
            _productVideoRepository = productVideoRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var productVideo = await _productVideoRepository.GetByIdAsync(request.Id);
            if (productVideo == null)
            {
                throw new PaddleThroughLychnidosException($"Product video with Id {request.Id} not found.", HttpStatusCode.NotFound);
            }

            return new GetByIdResponse
            {
                Id = productVideo.Id,
                ProductId = productVideo.ProductId,
                VideoUrl = productVideo.VideoUrl,
            };
        }
    }
}
