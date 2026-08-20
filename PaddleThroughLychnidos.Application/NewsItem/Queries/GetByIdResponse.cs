namespace PaddleThroughLychnidos.Application.NewsItem.Queries
{
    public class NewsItemDetailDto
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

    public class GetByIdResponse
    {
        public NewsItemDetailDto NewsItem { get; set; } = new();
    }
}
