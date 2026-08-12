namespace PaddleThroughLychnidos.Application.Region.Queries
{
    public class GetResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PolygonGeoJson { get; set; } = string.Empty;
    }
}
