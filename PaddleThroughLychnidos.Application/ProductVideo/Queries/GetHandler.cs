using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.ProductVideo.Queries
{
    public class GetHandler : IRequestHandler<GetRequest, List<GetResponse>>
    {
        private readonly IProductVideoRepository _productVideoRepository;

        public GetHandler(IProductVideoRepository productVideoRepository)
        {
            _productVideoRepository = productVideoRepository;
        }

        public async Task<List<GetResponse>> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var productVideos = await _productVideoRepository.GetAllAsync();

            var query = productVideos.AsEnumerable();

            if (request.ProductId.HasValue)
            {
                query = query.Where(pv => pv.ProductId == request.ProductId.Value);
            }

            return query
                .Select(productVideo => new GetResponse
                {
                    Id = productVideo.Id,
                    ProductId = productVideo.ProductId,
                    VideoUrl = productVideo.VideoUrl,
                })
                .ToList();
        }
    }
}
