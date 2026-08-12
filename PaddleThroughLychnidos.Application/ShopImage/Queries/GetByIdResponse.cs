namespace PaddleThroughLychnidos.Application.ShopImage.Queries
{
    public class GetByIdResponse
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
