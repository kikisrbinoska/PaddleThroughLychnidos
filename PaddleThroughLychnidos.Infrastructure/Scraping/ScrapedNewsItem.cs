namespace PaddleThroughLychnidos.Infrastructure.Scraping
{
    // Raw output of a single IScraperSource listing-page parse - deliberately
    // holds only a short excerpt (whatever the listing page itself shows),
    // never full article text. See NewsItem for the copyright rationale.
    public class ScrapedNewsItem
    {
        public string Title { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string SourceUrl { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public DateTime? PublishedAt { get; set; }
    }
}
