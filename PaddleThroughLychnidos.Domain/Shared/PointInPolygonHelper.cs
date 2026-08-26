using System.Text.Json;

namespace PaddleThroughLychnidos.Domain.Shared
{
    public static class PointInPolygonHelper
    {
        // Returns true if (latitude, longitude) falls inside the given
        // GeoJSON Polygon's outer ring (standard ray-casting algorithm).
        // Only the first ring is checked - none of this app's regions
        // define holes, and all seeded regions are simple Polygons (not
        // MultiPolygon). Returns false for null/empty/unparseable input
        // rather than throwing, since callers use this to opportunistically
        // match a shop to a region, not to validate the region itself.
        public static bool Contains(string? polygonGeoJson, double latitude, double longitude)
        {
            var ring = TryGetOuterRing(polygonGeoJson);
            if (ring == null || ring.Count < 3)
            {
                return false;
            }

            var inside = false;
            for (int i = 0, j = ring.Count - 1; i < ring.Count; j = i++)
            {
                var (lngI, latI) = ring[i];
                var (lngJ, latJ) = ring[j];

                var intersects = (latI > latitude) != (latJ > latitude) &&
                    longitude < (lngJ - lngI) * (latitude - latI) / (latJ - latI) + lngI;

                if (intersects)
                {
                    inside = !inside;
                }
            }

            return inside;
        }

        // GeoJSON coordinates are [longitude, latitude] pairs - the outer
        // ring is coordinates[0].
        private static List<(double Lng, double Lat)>? TryGetOuterRing(string? polygonGeoJson)
        {
            if (string.IsNullOrWhiteSpace(polygonGeoJson))
            {
                return null;
            }

            try
            {
                using var document = JsonDocument.Parse(polygonGeoJson);
                var coordinates = document.RootElement.GetProperty("coordinates");
                var outerRing = coordinates[0];

                var ring = new List<(double, double)>();
                foreach (var point in outerRing.EnumerateArray())
                {
                    ring.Add((point[0].GetDouble(), point[1].GetDouble()));
                }

                return ring;
            }
            catch (Exception ex) when (ex is JsonException or KeyNotFoundException or IndexOutOfRangeException or InvalidOperationException)
            {
                return null;
            }
        }
    }
}
