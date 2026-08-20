using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.LearnVideo.Queries
{
    public class LearnVideoListDto
    {
        public int Id { get; set; }
        public string YoutubeVideoId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string ChannelName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
    }

    public class GetPagedResponse
    {
        public List<LearnVideoListDto> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
