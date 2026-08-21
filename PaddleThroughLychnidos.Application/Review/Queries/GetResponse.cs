using PaddleThroughLychnidos.Domain.DTOs;

namespace PaddleThroughLychnidos.Application.Review.Queries
{
    public class ReviewListItemDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int ShopId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class GetResponse
    {
        public List<ReviewListItemDto> Items { get; set; } = new();
        public Metadata Metadata { get; set; } = new();
    }
}
