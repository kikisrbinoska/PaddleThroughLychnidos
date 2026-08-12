namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class AddResponse
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string Url { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
