namespace PaddleThroughLychnidos.Infrastructure.YouTube
{
    public class YouTubeSettings
    {
        public const string SectionName = "YouTube";

        public string ApiKey { get; set; } = string.Empty;

        /// <summary>Search calls cost 100 units each; the free tier's daily quota is 10,000 units/day. Defaults to 2,000 (20 searches) to leave headroom for other usage of the same API key/project.</summary>
        public int DailyUnitBudget { get; set; } = 2000;
    }
}
