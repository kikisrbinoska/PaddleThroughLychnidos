using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace PaddleThroughLychnidos.Infrastructure.Scraping
{
    // Parses https://ohrid1.com/ 's homepage/listing article teasers.
    // WordPress-style markup: each teaser is a heading (h2/h3) containing an
    // <a> to the full article, with a nearby thumbnail <img> and a Cyrillic
    // "month day, year" publish date. Selectors are best-effort against the
    // site's current markup (August 2026) - a site redesign will require
    // updating this class, which is why each source lives in its own file.
    public class Ohrid1ScraperSource : IScraperSource
    {
        private static readonly string[] MacedonianMonths =
        {
            "јануари", "февруари", "март", "април", "мај", "јуни",
            "јули", "август", "септември", "октомври", "ноември", "декември",
        };

        public string SourceName => "Ohrid1";

        private readonly HttpClient _httpClient;
        private readonly ILogger<Ohrid1ScraperSource> _logger;

        public Ohrid1ScraperSource(HttpClient httpClient, ILogger<Ohrid1ScraperSource> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<List<ScrapedNewsItem>> FetchLatestAsync(CancellationToken cancellationToken)
        {
            var results = new List<ScrapedNewsItem>();

            string html;
            try
            {
                html = await _httpClient.GetStringAsync("https://ohrid1.com/", cancellationToken);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Ohrid1 listing page fetch failed.");
                return results;
            }

            var document = new HtmlDocument();
            document.LoadHtml(html);

            var headings = document.DocumentNode.SelectNodes("//h2//a[@href] | //h3//a[@href]");
            if (headings is null)
            {
                _logger.LogWarning("Ohrid1 listing page returned no article headings - selectors may be stale.");
                return results;
            }

            foreach (var link in headings)
            {
                try
                {
                    var item = ParseArticleLink(link);
                    if (item is not null)
                    {
                        results.Add(item);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Skipped one malformed Ohrid1 article entry.");
                }
            }

            return results
                .GroupBy(r => r.SourceUrl)
                .Select(g => g.First())
                .ToList();
        }

        private ScrapedNewsItem? ParseArticleLink(HtmlNode link)
        {
            var href = link.GetAttributeValue("href", string.Empty);
            var title = HtmlEntity.DeEntitize(link.InnerText).Trim();

            if (string.IsNullOrWhiteSpace(href) || string.IsNullOrWhiteSpace(title))
            {
                return null;
            }

            // The heading's ancestor "teaser" block (article/div wrapping
            // both the heading and the excerpt/thumbnail/date) - walk up a
            // few levels since WordPress themes vary in nesting depth.
            var teaser = link.Ancestors().Take(6)
                .FirstOrDefault(n => n.Name is "article" or "div");

            var excerptNode = teaser?.SelectSingleNode(".//p");
            var excerpt = excerptNode is not null
                ? HtmlEntity.DeEntitize(excerptNode.InnerText).Trim()
                : string.Empty;

            var thumbnailNode = teaser?.SelectSingleNode(".//img[@src]");
            var thumbnailUrl = thumbnailNode?.GetAttributeValue("src", string.Empty) ?? string.Empty;

            var dateText = teaser is not null ? HtmlEntity.DeEntitize(teaser.InnerText) : string.Empty;
            var publishedAt = ParseMacedonianDate(dateText);

            return new ScrapedNewsItem
            {
                Title = title,
                Excerpt = excerpt,
                SourceUrl = href,
                ThumbnailUrl = thumbnailUrl,
                PublishedAt = publishedAt,
            };
        }

        // Looks for "[месец] [ден], [година]" (e.g. "август 20, 2026")
        // anywhere in the teaser's text.
        private static DateTime? ParseMacedonianDate(string text)
        {
            var lowered = text.ToLowerInvariant();

            for (var monthIndex = 0; monthIndex < MacedonianMonths.Length; monthIndex++)
            {
                var month = MacedonianMonths[monthIndex];
                var position = lowered.IndexOf(month, StringComparison.Ordinal);
                if (position < 0)
                {
                    continue;
                }

                var remainder = lowered[(position + month.Length)..];
                var match = System.Text.RegularExpressions.Regex.Match(remainder, @"\s*(\d{1,2}),?\s*(\d{4})");
                if (!match.Success)
                {
                    continue;
                }

                var day = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
                var year = int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture);

                try
                {
                    return new DateTime(year, monthIndex + 1, day, 0, 0, 0, DateTimeKind.Utc);
                }
                catch (ArgumentOutOfRangeException)
                {
                    return null;
                }
            }

            return null;
        }
    }
}
