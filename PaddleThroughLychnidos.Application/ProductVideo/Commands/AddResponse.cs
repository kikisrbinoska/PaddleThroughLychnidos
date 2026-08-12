namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class AddResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
