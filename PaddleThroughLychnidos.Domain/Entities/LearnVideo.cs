using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class LearnVideo : IEntity
    {
        public int Id { get; set; }

        public string YoutubeVideoId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string ChannelName { get; set; } = string.Empty;

        public LearnCategory Category { get; set; }

        // Best-effort keyword match of Title against Category.Name, set at
        // fetch time (see YouTubeSearchService). Null when no craft category
        // keyword matched, or the video is TraditionalFood (never matched -
        // related shops are Crafts-only, see LearnVideo/Queries/GetByIdHandler).
        public int? RelatedCategoryId { get; set; }
        public Category? RelatedCategory { get; set; }

        public DateTime PublishedAt { get; set; }
        public DateTime FetchedAt { get; set; }
    }
}
