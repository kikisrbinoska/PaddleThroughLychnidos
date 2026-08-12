namespace PaddleThroughLychnidos.Application.ProductVideo.Queries
{
    public class GetByIdResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
    }
}
