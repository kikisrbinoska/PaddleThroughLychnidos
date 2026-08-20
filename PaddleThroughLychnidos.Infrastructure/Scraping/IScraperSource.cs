namespace PaddleThroughLychnidos.Infrastructure.Scraping
{
    public interface IScraperSource
    {
        /// <summary>Matches NewsItem.SourceName exactly, e.g. "Ohrid1".</summary>
        string SourceName { get; }

        /// <summary>
        /// Fetches and parses the source's news listing page(s), returning
        /// whatever articles it finds. Never throws for a single malformed
        /// entry - skip it and keep parsing the rest; callers (NewsScraperJob)
        /// treat a whole-source failure as non-fatal already, but a partial
        /// per-source scrape shouldn't be lost to one bad node either.
        /// </summary>
        Task<List<ScrapedNewsItem>> FetchLatestAsync(CancellationToken cancellationToken);
    }
}
