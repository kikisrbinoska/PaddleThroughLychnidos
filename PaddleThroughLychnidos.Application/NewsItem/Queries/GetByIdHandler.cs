using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.NewsItem.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly INewsItemRepository _newsItemRepository;

        public GetByIdHandler(INewsItemRepository newsItemRepository)
        {
            _newsItemRepository = newsItemRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var newsItem = await _newsItemRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException($"News item with Id {request.Id} not found.", HttpStatusCode.NotFound);

            return new GetByIdResponse
            {
                NewsItem = new NewsItemDetailDto
                {
                    Id = newsItem.Id,
                    Title = newsItem.Title,
                    Summary = newsItem.Summary,
                    SourceUrl = newsItem.SourceUrl,
                    SourceName = newsItem.SourceName,
                    ThumbnailUrl = newsItem.ThumbnailUrl,
                    Category = newsItem.Category.ToString(),
                    PublishedAt = newsItem.PublishedAt,
                },
            };
        }
    }
}
