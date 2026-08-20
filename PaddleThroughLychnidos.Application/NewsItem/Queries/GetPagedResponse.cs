using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.NewsItem.Queries
{
    public class NewsItemListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string SourceUrl { get; set; } = string.Empty;
        public string SourceName { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
    }

    public class GetPagedResponse
    {
        public List<NewsItemListDto> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
