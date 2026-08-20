using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text.Json;
using System.Web;

namespace PaddleThroughLychnidos.Infrastructure.YouTube
{
    // Wraps the YouTube Data API v3 search#list endpoint. Only searches and
    // reads metadata (id/snippet) - never downloads or proxies video/media
    // content, consistent with the API's terms of service.
    public class YouTubeSearchService : IYouTubeSearchService
    {
        private const int UnitsPerSearch = 100;

        private readonly HttpClient _httpClient;
        private readonly YouTubeSettings _settings;
        private readonly ILogger<YouTubeSearchService> _logger;

        public int UnitsUsed { get; private set; }

        public bool IsBudgetExceeded => UnitsUsed + UnitsPerSearch > _settings.DailyUnitBudget;

        public YouTubeSearchService(HttpClient httpClient, IOptions<YouTubeSettings> settings, ILogger<YouTubeSearchService> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<List<YouTubeSearchResult>> SearchAsync(string query, int maxResults, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(_settings.ApiKey))
            {
                _logger.LogWarning("YouTube API key is not configured - skipping search for \"{query}\".", query);
                return new List<YouTubeSearchResult>();
            }

            if (IsBudgetExceeded)
            {
                _logger.LogWarning(
                    "YouTube daily unit budget ({budget}) would be exceeded by another search (used {used}) - skipping search for \"{query}\".",
                    _settings.DailyUnitBudget, UnitsUsed, query);
                return new List<YouTubeSearchResult>();
            }

            var url = "https://www.googleapis.com/youtube/v3/search"
                + $"?part=snippet&type=video&maxResults={maxResults}"
                + $"&q={HttpUtility.UrlEncode(query)}"
                + $"&key={HttpUtility.UrlEncode(_settings.ApiKey)}";

            HttpResponseMessage response;
            try
            {
                response = await _httpClient.GetAsync(url, cancellationToken);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "YouTube search request failed for \"{query}\".", query);
                return new List<YouTubeSearchResult>();
            }

            // Every attempted call counts against quota whether or not it
            // succeeds (e.g. a 403 from a bad/quota-exhausted key still
            // consumes the request) - track it regardless of outcome.
            UnitsUsed += UnitsPerSearch;

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError(
                    "YouTube search for \"{query}\" failed with status {status}: {body}",
                    query, response.StatusCode, body);
                return new List<YouTubeSearchResult>();
            }

            YouTubeSearchListResponse? parsed;
            try
            {
                parsed = await response.Content.ReadFromJsonAsync<YouTubeSearchListResponse>(cancellationToken: cancellationToken);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to parse YouTube search response for \"{query}\".", query);
                return new List<YouTubeSearchResult>();
            }

            if (parsed is null)
            {
                return new List<YouTubeSearchResult>();
            }

            return parsed.Items
                .Where(item => !string.IsNullOrWhiteSpace(item.Id.VideoId))
                .Select(item => new YouTubeSearchResult
                {
                    YoutubeVideoId = item.Id.VideoId!,
                    Title = item.Snippet.Title,
                    ChannelName = item.Snippet.ChannelTitle,
                    PublishedAt = item.Snippet.PublishedAt,
                    ThumbnailUrl = item.Snippet.Thumbnails.High?.Url
                        ?? item.Snippet.Thumbnails.Medium?.Url
                        ?? item.Snippet.Thumbnails.Default?.Url
                        ?? string.Empty,
                })
                .ToList();
        }
    }
}
