using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Infrastructure.YouTube
{
    // Periodically searches YouTube for Ohrid-relevant food/craft videos and
    // stores their metadata only (see IYouTubeSearchService) - no media is
    // ever downloaded. Runs on a fixed 36h interval, comfortably under the
    // 24-48h cadence the free YouTube Data API quota (10,000 units/day,
    // 100 units/search) can sustain for the ~9 queries run per cycle.
    public class LearnVideoSyncJob : BackgroundService
    {
        private static readonly TimeSpan Interval = TimeSpan.FromHours(36);
        private const int MaxResultsPerQuery = 10;

        private static readonly (LearnCategory Category, string Query)[] Queries =
        {
            (LearnCategory.TraditionalFood, "охридска пастрмка рецепт"),
            (LearnCategory.TraditionalFood, "охридска кујна"),
            (LearnCategory.TraditionalFood, "Ohrid traditional food recipe"),
            (LearnCategory.TraditionalFood, "Macedonian lake trout recipe"),
            (LearnCategory.Crafts, "охридски филигран изработка"),
            (LearnCategory.Crafts, "охридски бисер изработка"),
            (LearnCategory.Crafts, "wood carving tutorial Macedonia"),
            (LearnCategory.Crafts, "traditional Macedonian embroidery"),
            (LearnCategory.Crafts, "handmade paper making traditional"),
        };

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<LearnVideoSyncJob> _logger;

        public LearnVideoSyncJob(IServiceScopeFactory scopeFactory, ILogger<LearnVideoSyncJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Run once on startup, then on the fixed interval - avoids
            // waiting a full cycle before the LearnVideo table is populated
            // on a fresh environment.
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
            var searchService = scope.ServiceProvider.GetRequiredService<IYouTubeSearchService>();
            var learnVideoRepository = scope.ServiceProvider.GetRequiredService<ILearnVideoRepository>();
            var categoryRepository = scope.ServiceProvider.GetRequiredService<ICategoryRepository>();

            var categories = await categoryRepository.GetAllAsync();
            var categoryIdsByName = categories.ToDictionary(c => c.Name, c => c.Id);

            var storedCount = 0;

            foreach (var (category, query) in Queries)
            {
                if (searchService.IsBudgetExceeded)
                {
                    _logger.LogWarning(
                        "Stopping LearnVideo sync early - daily YouTube unit budget reached after {units} units used.",
                        searchService.UnitsUsed);
                    break;
                }

                List<YouTubeSearchResult> results;
                try
                {
                    results = await searchService.SearchAsync(query, MaxResultsPerQuery, stoppingToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError(ex, "LearnVideo sync search failed for query \"{query}\" - continuing with remaining queries.", query);
                    continue;
                }

                if (results.Count == 0)
                {
                    continue;
                }

                var existingIds = await learnVideoRepository.GetExistingYoutubeVideoIdsAsync(
                    results.Select(r => r.YoutubeVideoId));

                foreach (var result in results)
                {
                    if (existingIds.Contains(result.YoutubeVideoId))
                    {
                        continue;
                    }

                    // Prevents duplicate inserts within the same run when the
                    // same video surfaces for more than one query.
                    existingIds.Add(result.YoutubeVideoId);

                    int? relatedCategoryId = null;
                    if (category == LearnCategory.Crafts)
                    {
                        var matchedName = CraftCategoryMatcher.MatchCategoryName(result.Title);
                        if (matchedName is not null && categoryIdsByName.TryGetValue(matchedName, out var matchedId))
                        {
                            relatedCategoryId = matchedId;
                        }
                    }

                    await learnVideoRepository.AddAsync(new LearnVideo
                    {
                        YoutubeVideoId = result.YoutubeVideoId,
                        Title = result.Title,
                        ThumbnailUrl = result.ThumbnailUrl,
                        ChannelName = result.ChannelName,
                        Category = category,
                        RelatedCategoryId = relatedCategoryId,
                        PublishedAt = result.PublishedAt,
                        FetchedAt = DateTime.UtcNow,
                    });

                    storedCount++;
                }
            }

            _logger.LogInformation(
                "LearnVideo sync finished - stored {stored} new video(s), used {units} YouTube API unit(s).",
                storedCount, searchService.UnitsUsed);
        }
    }
}
