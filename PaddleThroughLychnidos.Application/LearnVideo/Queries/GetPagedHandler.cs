using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.LearnVideo.Queries
{
    public class GetPagedHandler : IRequestHandler<GetPagedRequest, GetPagedResponse>
    {
        private readonly ILearnVideoRepository _learnVideoRepository;

        public GetPagedHandler(ILearnVideoRepository learnVideoRepository)
        {
            _learnVideoRepository = learnVideoRepository;
        }

        public async Task<GetPagedResponse> Handle(GetPagedRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _learnVideoRepository.GetPagedAsync(pageNumber, pageSize, request.Category);

            var items = list
                .Select(video => new LearnVideoListDto
                {
                    Id = video.Id,
                    YoutubeVideoId = video.YoutubeVideoId,
                    Title = video.Title,
                    ThumbnailUrl = video.ThumbnailUrl,
                    ChannelName = video.ChannelName,
                    Category = video.Category.ToString(),
                    PublishedAt = video.PublishedAt,
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
