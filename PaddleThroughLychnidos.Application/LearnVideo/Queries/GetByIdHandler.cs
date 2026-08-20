using MediatR;
using PaddleThroughLychnidos.Application.Shop.Queries;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.LearnVideo.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly ILearnVideoRepository _learnVideoRepository;
        private readonly IShopRepository _shopRepository;

        public GetByIdHandler(ILearnVideoRepository learnVideoRepository, IShopRepository shopRepository)
        {
            _learnVideoRepository = learnVideoRepository;
            _shopRepository = shopRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var video = await _learnVideoRepository.GetByIdWithRelatedCategoryAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException($"Learn video with Id {request.Id} not found.", HttpStatusCode.NotFound);

            var relatedShops = new List<ShopListItem>();

            if (video.RelatedCategoryId.HasValue)
            {
                var (_, shops) = await _shopRepository.GetPagedAsync(
                    pageNumber: null,
                    pageSize: null,
                    searchWord: null,
                    categoryId: video.RelatedCategoryId.Value,
                    regionId: null);

                relatedShops = shops
                    .Select(shop => new ShopListItem
                    {
                        Id = shop.Id,
                        OwnerId = shop.OwnerId,
                        Name = shop.Name,
                        Description = shop.Description,
                        Latitude = shop.Latitude,
                        Longitude = shop.Longitude,
                        Address = shop.Address,
                        RegionId = shop.RegionId,
                        RegionName = shop.Region?.Name ?? string.Empty,
                        CategoryId = shop.CategoryId,
                        CategoryName = shop.Category?.Name ?? string.Empty,
                        ImageUrl = shop.Images.FirstOrDefault()?.Url ?? string.Empty,
                        Rating = shop.Rating,
                        UserRatingCount = shop.UserRatingCount,
                        IsVerified = shop.IsVerified,
                        OpeningHours = shop.OpeningHours,
                        IsOpenNow = OpenNowCalculator.IsOpenAt(shop.StructuredHoursJson, DateTimeOffset.Now),
                    })
                    .ToList();
            }

            return new GetByIdResponse
            {
                Video = new LearnVideoDetailDto
                {
                    Id = video.Id,
                    YoutubeVideoId = video.YoutubeVideoId,
                    Title = video.Title,
                    ThumbnailUrl = video.ThumbnailUrl,
                    ChannelName = video.ChannelName,
                    Category = video.Category.ToString(),
                    PublishedAt = video.PublishedAt,
                },
                RelatedShops = relatedShops,
            };
        }
    }
}
