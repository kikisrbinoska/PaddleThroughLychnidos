using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Infrastructure.Scraping
{
    // Periodically scrapes the configured IScraperSource list, filters out
    // non-tourist-relevant articles, categorizes the rest, and stores only
    // title + short summary + source link (never full article text - see
    // NewsItem). Runs on a 12h interval per the task's 6-12h guidance.
    //
    // Sources included: Ohrid1ScraperSource, OhridGovMkScraperSource.
    // ohridnews.com was evaluated and excluded - its listing page renders
    // articles client-side via JavaScript, so a server-side HTML fetch sees
    // only lazy-load placeholders (see conversation notes; would need a
    // headless-browser scraper to support, out of scope here).
    // ohrid.daily.mk was excluded entirely - the site itself displays a
    // notice that it suspended content aggregation/redistribution as of
    // May 2025.
    public class NewsScraperJob : BackgroundService
    {
        private static readonly TimeSpan Interval = TimeSpan.FromHours(12);

        // Politeness delay between requests to the same domain. Each source
        // in this job currently makes one request per run, so this only
        // matters if a source is later extended to fetch multiple pages.
        private static readonly TimeSpan CrawlDelay = TimeSpan.FromSeconds(2);

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<NewsScraperJob> _logger;

        public NewsScraperJob(IServiceScopeFactory scopeFactory, ILogger<NewsScraperJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await RunOnceAsync(stoppingToken);

            using var timer = new PeriodicTimer(Interval);
            while (!stoppingToken.IsCancellationRequested
                && await timer.WaitForNextTickAsync(stoppingToken))
            {
                await RunOnceAsync(stoppingToken);
            }
        }

        private async Task RunOnceAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var sources = scope.ServiceProvider.GetServices<IScraperSource>().ToList();
            var newsItemRepository = scope.ServiceProvider.GetRequiredService<INewsItemRepository>();

            var storedCount = 0;
            var excludedCount = 0;

            for (var i = 0; i < sources.Count; i++)
            {
                var source = sources[i];

                List<ScrapedNewsItem> scraped;
                try
                {
                    scraped = await source.FetchLatestAsync(stoppingToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError(ex, "News scrape failed for source \"{source}\" - continuing with remaining sources.", source.SourceName);
                    continue;
                }

                if (scraped.Count == 0)
                {
                    continue;
                }

                var existingUrls = await newsItemRepository.GetExistingSourceUrlsAsync(
                    scraped.Select(s => s.SourceUrl));

                foreach (var article in scraped)
                {
                    if (existingUrls.Contains(article.SourceUrl))
                    {
                        continue;
                    }
                    existingUrls.Add(article.SourceUrl);

                    if (NewsRelevanceClassifier.IsExcluded(article.Title, article.Excerpt))
                    {
                        excludedCount++;
                        continue;
                    }

                    var summary = SummaryBuilder.BuildSummary(article.Excerpt);
                    var category = NewsRelevanceClassifier.Categorize(article.Title, article.Excerpt, article.PublishedAt);

                    await newsItemRepository.AddAsync(new Domain.Entities.NewsItem
                    {
                        Title = article.Title,
                        Summary = summary,
                        SourceUrl = article.SourceUrl,
                        SourceName = source.SourceName,
                        ThumbnailUrl = article.ThumbnailUrl,
                        Category = category,
                        PublishedAt = article.PublishedAt ?? DateTime.UtcNow,
                        FetchedAt = DateTime.UtcNow,
                    });

                    storedCount++;
                }

                // Politeness delay before hitting the next source's domain.
                if (i < sources.Count - 1)
                {
                    await Task.Delay(CrawlDelay, stoppingToken);
                }
            }

            _logger.LogInformation(
                "News scrape finished - stored {stored} new item(s), excluded {excluded} non-tourist-relevant item(s).",
                storedCount, excludedCount);
        }
    }
}
