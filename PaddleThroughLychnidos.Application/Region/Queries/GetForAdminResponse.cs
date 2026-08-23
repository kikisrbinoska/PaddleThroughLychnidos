namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetForAdminResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PolygonGeoJson { get; set; } = string.Empty;
        public int ShopCount { get; set; }
        public int ItineraryCount { get; set; }
    }
}
