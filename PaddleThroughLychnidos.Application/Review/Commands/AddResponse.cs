namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class AddResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ShopId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsNewStamp { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
