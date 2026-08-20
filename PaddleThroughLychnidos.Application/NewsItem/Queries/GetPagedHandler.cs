using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.NewsItem.Queries
{
    public class GetPagedHandler : IRequestHandler<GetPagedRequest, GetPagedResponse>
    {
        private readonly INewsItemRepository _newsItemRepository;

        public GetPagedHandler(INewsItemRepository newsItemRepository)
        {
            _newsItemRepository = newsItemRepository;
        }

        public async Task<GetPagedResponse> Handle(GetPagedRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _newsItemRepository.GetPagedAsync(pageNumber, pageSize, request.Category);

            var items = list
                .Select(news => new NewsItemListDto
                {
                    Id = news.Id,
                    Title = news.Title,
                    Summary = news.Summary,
                    SourceUrl = news.SourceUrl,
                    SourceName = news.SourceName,
                    ThumbnailUrl = news.ThumbnailUrl,
                    Category = news.Category.ToString(),
                    PublishedAt = news.PublishedAt,
                })
                .ToList();

            var totalPages = (int)Math.Ceiling(count / (double)pageSize);

            return new GetPagedResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
