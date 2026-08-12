using MediatR;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class AddRequest : IRequest<AddResponse>
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PolygonGeoJson { get; set; } = string.Empty;
    }
}
