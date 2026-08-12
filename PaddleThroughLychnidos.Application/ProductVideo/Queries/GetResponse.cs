namespace PaddleThroughLychnidos.Application.ProductVideo.Queries
{
    public class GetResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
    }
}
