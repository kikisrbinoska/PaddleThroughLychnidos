using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Infrastructure.Scraping
{
    // Cheap keyword-based relevance filter + categorization for scraped
    // articles - no LLM call, per task decision to keep this simple.
    // Runs against the title (and excerpt, where available) before a
    // ScrapedNewsItem becomes a NewsItem row.
    public static class NewsRelevanceClassifier
    {
        // Local community news that isn't tourist-relevant - crime, traffic
        // incidents, missing persons, administrative/procedural notices.
        // Matching any of these skips the article entirely, regardless of
        // category keywords below.
        private static readonly string[] ExclusionKeywords =
        {
            "уапсен", "уапсена", "приведен", "приведена",
            "сообраќајна незгода", "сообраќајка",
            "исчезната", "исчезнат", "потрага по",
            "лишен од слобода", "лишена од слобода",
            "кривична пријава", "поднесена кривична",
            "истрага", "обвинение",
        };

        private static readonly string[] ExhibitionKeywords =
        {
            "изложба", "изложбa", "exhibition", "галерија отвора",
        };

        private static readonly string[] EventKeywords =
        {
            "фестивал", "festival", "концерт", "concert", "настан", "event",
            "манифестација", "прослава",
        };

        /// <summary>True if the article should be skipped entirely (not tourist-relevant).</summary>
        public static bool IsExcluded(string title, string excerpt)
        {
            var text = $"{title} {excerpt}".ToLowerInvariant();
            return ExclusionKeywords.Any(keyword => text.Contains(keyword, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Categorizes an already-included article. publishedAt is used only
        /// to distinguish CurrentEvent (happening now/this week) from
        /// UpcomingEvent (a festival/concert further out) when event
        /// keywords match - articles with no event/exhibition keywords at
        /// all fall through to GeneralNews.
        /// </summary>
        public static NewsCategory Categorize(string title, string excerpt, DateTime? publishedAt)
        {
            var text = $"{title} {excerpt}".ToLowerInvariant();

            if (ExhibitionKeywords.Any(keyword => text.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
            {
                return NewsCategory.Exhibition;
            }

            if (EventKeywords.Any(keyword => text.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
            {
                // Recently published event announcements read as "happening
                // now/this week" (CurrentEvent); anything older is more
                // likely announcing something further in the future
                // (UpcomingEvent) - a rough heuristic in the absence of a
                // parsed event date, consistent with keeping this
                // keyword-only per the task's scope.
                var isRecent = publishedAt.HasValue && publishedAt.Value >= DateTime.UtcNow.AddDays(-3);
                return isRecent ? NewsCategory.CurrentEvent : NewsCategory.UpcomingEvent;
            }

            return NewsCategory.GeneralNews;
        }
    }
}
