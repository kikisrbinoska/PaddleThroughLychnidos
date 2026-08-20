namespace PaddleThroughLychnidos.Infrastructure.YouTube
{
    // Flattened projection of the fields this app needs from a YouTube Data
    // API v3 search#list item - see IYouTubeSearchService for the raw
    // response shape this is parsed from.
    public class YouTubeSearchResult
    {
        public string YoutubeVideoId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string ChannelName { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
    }
}
