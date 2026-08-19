using System.Text.Json.Serialization;

namespace PaddleThroughLychnidos.Application.ShopImport.Commands
{
    public class OhridShopImportRecord
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("formattedAddress")]
        public string FormattedAddress { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [JsonPropertyName("website")]
        public string? Website { get; set; }

        [JsonPropertyName("rating")]
        public decimal? Rating { get; set; }

        [JsonPropertyName("userRatingCount")]
        public double? UserRatingCount { get; set; }

        [JsonPropertyName("googleTypes")]
        public string? GoogleTypes { get; set; }

        [JsonPropertyName("matchedCategories")]
        public string? MatchedCategories { get; set; }

        [JsonPropertyName("businessStatus")]
        public string? BusinessStatus { get; set; }

        [JsonPropertyName("lat")]
        public double Lat { get; set; }

        [JsonPropertyName("lng")]
        public double Lng { get; set; }
    }
}
