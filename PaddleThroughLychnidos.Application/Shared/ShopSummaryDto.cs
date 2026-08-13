namespace PaddleThroughLychnidos.Application.Shared
{
    public class ShopSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
