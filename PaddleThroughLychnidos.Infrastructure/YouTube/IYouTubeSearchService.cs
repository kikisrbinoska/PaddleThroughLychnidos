namespace PaddleThroughLychnidos.Infrastructure.YouTube
{
    public interface IYouTubeSearchService
    {
        /// <summary>
        /// Runs a YouTube Data API v3 search#list call for the given query
        /// (part=snippet, type=video). Returns an empty list, without
        /// throwing, if the per-run unit budget has already been used up -
        /// callers should check <see cref="IsBudgetExceeded"/> beforehand to
        /// decide whether it's worth calling at all.
        /// </summary>
        Task<List<YouTubeSearchResult>> SearchAsync(string query, int maxResults, CancellationToken cancellationToken);

        /// <summary>Total quota units consumed via this instance so far (100 per successful search call).</summary>
        int UnitsUsed { get; }

        bool IsBudgetExceeded { get; }
    }
}
