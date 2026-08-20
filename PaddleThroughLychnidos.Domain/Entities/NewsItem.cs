using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    // Deliberately does NOT store full article bodies - only a short
    // extracted/generated summary, title, and a link back to the source.
    // See IScraperSource implementations for how Summary is derived; never
    // add a field here for full article text (copyright - see task notes
    // in NewsScraperJob).
    public class NewsItem : IEntity
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string SourceUrl { get; set; } = string.Empty;
        public string SourceName { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;

        public NewsCategory Category { get; set; }

        public DateTime PublishedAt { get; set; }
        public DateTime FetchedAt { get; set; }
    }
}
