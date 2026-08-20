using System.Text.Json.Serialization;

namespace PaddleThroughLychnidos.Infrastructure.YouTube
{
    // Minimal subset of the YouTube Data API v3 search#list response
    // (https://developers.google.com/youtube/v3/docs/search/list) needed by
    // YouTubeSearchService - not a full mirror of the API surface.
    internal class YouTubeSearchListResponse
    {
        [JsonPropertyName("items")]
        public List<YouTubeSearchItem> Items { get; set; } = new();
    }

    internal class YouTubeSearchItem
    {
        [JsonPropertyName("id")]
        public YouTubeSearchItemId Id { get; set; } = new();

        [JsonPropertyName("snippet")]
        public YouTubeSearchItemSnippet Snippet { get; set; } = new();
    }

    internal class YouTubeSearchItemId
    {
        [JsonPropertyName("videoId")]
        public string? VideoId { get; set; }
    }

    internal class YouTubeSearchItemSnippet
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("channelTitle")]
        public string ChannelTitle { get; set; } = string.Empty;

        [JsonPropertyName("publishedAt")]
        public DateTime PublishedAt { get; set; }

        [JsonPropertyName("thumbnails")]
        public YouTubeSearchItemThumbnails Thumbnails { get; set; } = new();
    }

    internal class YouTubeSearchItemThumbnails
    {
        [JsonPropertyName("high")]
        public YouTubeThumbnail? High { get; set; }

        [JsonPropertyName("medium")]
        public YouTubeThumbnail? Medium { get; set; }

        [JsonPropertyName("default")]
        public YouTubeThumbnail? Default { get; set; }
    }

    internal class YouTubeThumbnail
    {
        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;
    }
}
