using PaddleThroughLychnidos.Application.Shop.Queries;

namespace PaddleThroughLychnidos.Application.LearnVideo.Queries
{
    public class LearnVideoDetailDto
    {
        public int Id { get; set; }
        public string YoutubeVideoId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string ChannelName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
    }

    public class GetByIdResponse
    {
        public LearnVideoDetailDto Video { get; set; } = new();

        // Shops sharing the video's best-effort matched craft category.
        // Always empty for TraditionalFood videos, or Crafts videos whose
        // title matched no known category keyword - see
        // YouTubeSearchService's keyword map for how RelatedCategoryId is set.
        public List<ShopListItem> RelatedShops { get; set; } = new();
    }
}
