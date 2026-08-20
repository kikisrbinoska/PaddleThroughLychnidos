using System.Text;

namespace PaddleThroughLychnidos.Infrastructure.Scraping
{
    // Trims a listing page's own excerpt down to 2-3 sentences - the excerpt
    // itself is already short (a listing-page teaser, not the article body),
    // this just enforces the hard cap per the copyright rule in NewsItem.
    public static class SummaryBuilder
    {
        private const int MaxSentences = 3;
        private const int MaxLength = 400;

        public static string BuildSummary(string excerpt)
        {
            var trimmed = excerpt.Trim();
            if (trimmed.Length == 0)
            {
                return string.Empty;
            }

            var sentences = SplitSentences(trimmed);
            var taken = sentences.Take(MaxSentences);
            var summary = string.Join(" ", taken).Trim();

            if (summary.Length > MaxLength)
            {
                summary = summary[..MaxLength].TrimEnd() + "...";
            }

            return summary;
        }

        private static List<string> SplitSentences(string text)
        {
            var sentences = new List<string>();
            var current = new StringBuilder();

            foreach (var ch in text)
            {
                current.Append(ch);
                if (ch is '.' or '!' or '?')
                {
                    sentences.Add(current.ToString().Trim());
                    current.Clear();
                }
            }

            if (current.Length > 0)
            {
                sentences.Add(current.ToString().Trim());
            }

            return sentences.Where(s => s.Length > 0).ToList();
        }
    }
}
