using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace PaddleThroughLychnidos.Infrastructure.Scraping
{
    // Parses https://ohrid.gov.mk/category/вести/ (municipal WordPress
    // "Вести" category). Each teaser is an <a> wrapping a thumbnail <div>/
    // <img> and an <h4> title, with an English-format publish date
    // ("Month Day, Year") as plain text nearby and an excerpt trailing the
    // title up to a "Прочитајте повеќе" (Read more) link. Best-effort
    // selectors against the site's current markup (August 2026).
    public class OhridGovMkScraperSource : IScraperSource
    {
        private const string ListingUrl = "https://ohrid.gov.mk/category/%D0%B2%D0%B5%D1%81%D1%82%D0%B8/";

        public string SourceName => "Ohrid.gov.mk";

        private readonly HttpClient _httpClient;
        private readonly ILogger<OhridGovMkScraperSource> _logger;

        public OhridGovMkScraperSource(HttpClient httpClient, ILogger<OhridGovMkScraperSource> logger)
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
                html = await _httpClient.GetStringAsync(ListingUrl, cancellationToken);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Ohrid.gov.mk listing page fetch failed.");
                return results;
            }

            var document = new HtmlDocument();
            document.LoadHtml(html);

            var titleNodes = document.DocumentNode.SelectNodes("//h4");
            if (titleNodes is null)
            {
                _logger.LogWarning("Ohrid.gov.mk listing page returned no h4 title nodes - selectors may be stale.");
                return results;
            }

            foreach (var titleNode in titleNodes)
            {
                try
                {
                    var item = ParseTitleNode(titleNode);
                    if (item is not null)
                    {
                        results.Add(item);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Skipped one malformed Ohrid.gov.mk article entry.");
                }
            }

            return results
                .GroupBy(r => r.SourceUrl)
                .Select(g => g.First())
                .ToList();
        }

        private ScrapedNewsItem? ParseTitleNode(HtmlNode titleNode)
        {
            // The <h4> title lives inside the article's wrapping <a>.
            var anchor = titleNode.Ancestors("a").FirstOrDefault()
                ?? titleNode.SelectSingleNode(".//a");

            var href = anchor?.GetAttributeValue("href", string.Empty) ?? string.Empty;
            var title = HtmlEntity.DeEntitize(titleNode.InnerText).Trim();

            if (string.IsNullOrWhiteSpace(href) || string.IsNullOrWhiteSpace(title))
            {
                return null;
            }

            var teaser = titleNode.Ancestors().Take(6)
                .FirstOrDefault(n => n.Name is "article" or "div");

            var thumbnailNode = teaser?.SelectSingleNode(".//img[@src]");
            var thumbnailUrl = thumbnailNode?.GetAttributeValue("src", string.Empty) ?? string.Empty;

            var excerptNode = teaser?.SelectSingleNode(".//p");
            var excerpt = excerptNode is not null
                ? HtmlEntity.DeEntitize(excerptNode.InnerText).Trim()
                : string.Empty;
            // Strip the trailing "Прочитајте повеќе" / "Read more" link text
            // if it got pulled in as part of the paragraph's inner text.
            excerpt = System.Text.RegularExpressions.Regex.Replace(
                excerpt, @"(Прочитајте повеќе|Read more)\s*$", string.Empty, System.Text.RegularExpressions.RegexOptions.IgnoreCase).Trim();

            var teaserText = teaser is not null ? HtmlEntity.DeEntitize(teaser.InnerText) : string.Empty;
            var publishedAt = ParseEnglishDate(teaserText);

            return new ScrapedNewsItem
            {
                Title = title,
                Excerpt = excerpt,
                SourceUrl = href,
                ThumbnailUrl = thumbnailUrl,
                PublishedAt = publishedAt,
            };
        }

        // Looks for "Month Day, Year" (e.g. "August 19, 2026") anywhere in
        // the teaser's text.
        private static DateTime? ParseEnglishDate(string text)
        {
            var match = System.Text.RegularExpressions.Regex.Match(
                text, @"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase);

            if (!match.Success)
            {
                return null;
            }

            var dateString = $"{match.Groups[1].Value} {match.Groups[2].Value}, {match.Groups[3].Value}";
            if (DateTime.TryParse(dateString, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
            {
                return DateTime.SpecifyKind(parsed, DateTimeKind.Utc);
            }

            return null;
        }
    }
}
