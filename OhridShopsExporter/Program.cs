using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;

namespace OhridShopsExporter;

internal static class Program
{
    private const string SearchUrl = "https://places.googleapis.com/v1/places:searchText";

    private const string FieldMask =
        "places.id,places.displayName,places.formattedAddress,places.location," +
        "places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours," +
        "places.rating,places.userRatingCount,places.types,places.businessStatus," +
        "places.editorialSummary,places.photos";

    private static readonly TimeSpan DelayBetweenRequests = TimeSpan.FromMilliseconds(250);

    private static readonly (string Query, string Category)[] Queries =
    [
        ("охридски бисер продавница", "Jewelry"),
        ("jewelry shop Ohrid", "Jewelry"),

        ("народна носија Охрид", "TraditionalCostume"),
        ("traditional costume shop Ohrid", "TraditionalCostume"),
        ("везилка Охрид", "TraditionalCostume"),
        ("embroidery shop Ohrid", "TraditionalCostume"),
        ("народни носии продажба Охрид", "TraditionalCostume"),

        ("резба во дрво Охрид", "WoodCarving"),
        ("wood carving shop Ohrid", "WoodCarving"),
        ("дрвени сувенири Охрид", "WoodCarving"),

        ("рачно изработена хартија Охрид", "HandmadePaper"),
        ("handmade paper workshop Ohrid", "HandmadePaper"),
        ("книговез Охрид", "HandmadePaper"),
        ("bookbinding shop Ohrid", "HandmadePaper"),

        ("иконопис работилница Охрид", "Iconography"),
        ("icon painting shop Ohrid", "Iconography"),

        ("уметничка галерија Охрид", "ArtGallery"),
        ("art gallery Ohrid", "ArtGallery"),

        ("занаетчиска работилница Охрид", "CraftWorkshopGeneral"),
        ("craft workshop Ohrid", "CraftWorkshopGeneral"),

        ("сувенири продавница Охрид", "SouvenirShop"),
        ("souvenir shop Ohrid", "SouvenirShop"),
    ];

    private static async Task<int> Main()
    {
        string apiKey;
        try
        {
            apiKey = ResolveApiKey();
        }
        catch (InvalidOperationException ex)
        {
            Console.Error.WriteLine(ex.Message);
            return 1;
        }

        var outputDir = Path.Combine(AppContext.BaseDirectory, "output");
        Directory.CreateDirectory(outputDir);

        using var http = new HttpClient();
        http.DefaultRequestHeaders.Add("X-Goog-Api-Key", apiKey);
        http.DefaultRequestHeaders.Add("X-Goog-FieldMask", FieldMask);

        var places = new Dictionary<string, PlaceRecord>();

        foreach (var (query, category) in Queries)
        {
            Console.WriteLine($"Searching: \"{query}\" [{category}]");

            List<RawPlace> results;
            try
            {
                results = await SearchTextAsync(http, query);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"  Request failed for \"{query}\": {ex.Message}");
                await Task.Delay(DelayBetweenRequests);
                continue;
            }

            Console.WriteLine($"  -> {results.Count} result(s)");

            foreach (var raw in results)
            {
                if (string.IsNullOrEmpty(raw.Id))
                {
                    continue;
                }

                if (!places.TryGetValue(raw.Id, out var record))
                {
                    record = PlaceRecord.FromRaw(raw);
                    places[raw.Id] = record;
                }

                record.MatchedCategories.Add(category);
                record.MatchedQueries.Add(query);
            }

            await Task.Delay(DelayBetweenRequests);
        }

        var allPlaces = places.Values
            .OrderBy(p => p.DisplayName, StringComparer.OrdinalIgnoreCase)
            .ToList();

        WriteJson(Path.Combine(outputDir, "ohrid-shops-dataset.json"), allPlaces);
        WriteCsv(Path.Combine(outputDir, "ohrid-shops-dataset.csv"), allPlaces);

        PrintSummary(allPlaces);

        return 0;
    }

    private static string ResolveApiKey()
    {
        var fromEnv = Environment.GetEnvironmentVariable("GOOGLE_PLACES_API_KEY");
        if (!string.IsNullOrWhiteSpace(fromEnv))
        {
            return fromEnv;
        }

        var config = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true)
            .Build();

        var fromConfig = config["GooglePlacesApiKey"];
        if (!string.IsNullOrWhiteSpace(fromConfig))
        {
            return fromConfig;
        }

        throw new InvalidOperationException(
            "No API key found. Set the GOOGLE_PLACES_API_KEY environment variable, " +
            "or create appsettings.json (see appsettings.json.example) with a \"GooglePlacesApiKey\" value.");
    }

    private static async Task<List<RawPlace>> SearchTextAsync(HttpClient http, string query)
    {
        var body = JsonSerializer.Serialize(new { textQuery = query });
        using var content = new StringContent(body, Encoding.UTF8, "application/json");

        using var response = await http.PostAsync(SearchUrl, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"HTTP {(int)response.StatusCode} {response.ReasonPhrase}: {responseBody}");
        }

        var parsed = JsonSerializer.Deserialize<SearchTextResponse>(responseBody, JsonOptions);
        return parsed?.Places ?? [];
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private static void WriteJson(string path, List<PlaceRecord> places)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        };
        File.WriteAllText(path, JsonSerializer.Serialize(places, options));
        Console.WriteLine($"Wrote {places.Count} places to {path}");
    }

    private static void WriteCsv(string path, List<PlaceRecord> places)
    {
        var sb = new StringBuilder();
        sb.AppendLine(string.Join(',', [
            "name", "formattedAddress", "phone", "website", "rating", "userRatingCount",
            "googleTypes", "matchedCategories", "businessStatus", "lat", "lng",
        ]));

        foreach (var p in places)
        {
            sb.AppendLine(string.Join(',', [
                CsvField(p.DisplayName),
                CsvField(p.FormattedAddress),
                CsvField(p.NationalPhoneNumber),
                CsvField(p.WebsiteUri),
                CsvField(p.Rating?.ToString(System.Globalization.CultureInfo.InvariantCulture)),
                CsvField(p.UserRatingCount?.ToString(System.Globalization.CultureInfo.InvariantCulture)),
                CsvField(string.Join(';', p.Types)),
                CsvField(string.Join(';', p.MatchedCategories)),
                CsvField(p.BusinessStatus),
                CsvField(p.Latitude?.ToString(System.Globalization.CultureInfo.InvariantCulture)),
                CsvField(p.Longitude?.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            ]));
        }

        File.WriteAllText(path, sb.ToString());
        Console.WriteLine($"Wrote {places.Count} places to {path}");
    }

    private static string CsvField(string? value)
    {
        value ??= string.Empty;
        if (value.Contains(',') || value.Contains('"') || value.Contains('\n') || value.Contains('\r'))
        {
            return $"\"{value.Replace("\"", "\"\"")}\"";
        }

        return value;
    }

    private static void PrintSummary(List<PlaceRecord> places)
    {
        Console.WriteLine();
        Console.WriteLine("===== Summary =====");
        Console.WriteLine($"Total unique places found: {places.Count}");

        Console.WriteLine();
        Console.WriteLine("Count per category:");
        var categoryCounts = Queries
            .Select(q => q.Category)
            .Distinct()
            .ToDictionary(c => c, c => places.Count(p => p.MatchedCategories.Contains(c)));

        foreach (var (category, count) in categoryCounts.OrderByDescending(kv => kv.Value))
        {
            Console.WriteLine($"  {category}: {count}");
        }

        var nonOperational = places.Where(p => p.BusinessStatus is not (null or "OPERATIONAL")).ToList();
        Console.WriteLine();
        Console.WriteLine($"Places with businessStatus != OPERATIONAL (possibly closed): {nonOperational.Count}");
        foreach (var p in nonOperational)
        {
            Console.WriteLine($"  - {p.DisplayName} [{p.BusinessStatus}]");
        }

        Console.WriteLine();
        var traditionalCostumeCount = categoryCounts.GetValueOrDefault("TraditionalCostume", 0);
        if (traditionalCostumeCount <= 2)
        {
            Console.WriteLine(
                $"NOTE: \"TraditionalCostume\" returned only {traditionalCostumeCount} result(s). " +
                "Traditional costume/embroidery makers often lack Google Maps presence - manual field research recommended.");
        }
    }
}

internal sealed class SearchTextResponse
{
    [JsonPropertyName("places")]
    public List<RawPlace> Places { get; set; } = [];
}

internal sealed class RawPlace
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("displayName")]
    public LocalizedText? DisplayName { get; set; }

    [JsonPropertyName("formattedAddress")]
    public string? FormattedAddress { get; set; }

    [JsonPropertyName("location")]
    public PlaceLocation? Location { get; set; }

    [JsonPropertyName("nationalPhoneNumber")]
    public string? NationalPhoneNumber { get; set; }

    [JsonPropertyName("websiteUri")]
    public string? WebsiteUri { get; set; }

    [JsonPropertyName("regularOpeningHours")]
    public JsonElement? RegularOpeningHours { get; set; }

    [JsonPropertyName("rating")]
    public double? Rating { get; set; }

    [JsonPropertyName("userRatingCount")]
    public int? UserRatingCount { get; set; }

    [JsonPropertyName("types")]
    public List<string>? Types { get; set; }

    [JsonPropertyName("businessStatus")]
    public string? BusinessStatus { get; set; }

    [JsonPropertyName("editorialSummary")]
    public LocalizedText? EditorialSummary { get; set; }

    [JsonPropertyName("photos")]
    public JsonElement? Photos { get; set; }
}

internal sealed class LocalizedText
{
    [JsonPropertyName("text")]
    public string? Text { get; set; }

    [JsonPropertyName("languageCode")]
    public string? LanguageCode { get; set; }
}

internal sealed class PlaceLocation
{
    [JsonPropertyName("latitude")]
    public double? Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double? Longitude { get; set; }
}

internal sealed class PlaceRecord
{
    public required string Id { get; init; }
    public string? DisplayName { get; init; }
    public string? FormattedAddress { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? NationalPhoneNumber { get; init; }
    public string? WebsiteUri { get; init; }
    public JsonElement? RegularOpeningHours { get; init; }
    public double? Rating { get; init; }
    public int? UserRatingCount { get; init; }
    public List<string> Types { get; init; } = [];
    public string? BusinessStatus { get; init; }
    public string? EditorialSummary { get; init; }
    public JsonElement? Photos { get; init; }

    public HashSet<string> MatchedCategories { get; } = new(StringComparer.Ordinal);
    public List<string> MatchedQueries { get; } = [];

    public static PlaceRecord FromRaw(RawPlace raw) => new()
    {
        Id = raw.Id!,
        DisplayName = raw.DisplayName?.Text,
        FormattedAddress = raw.FormattedAddress,
        Latitude = raw.Location?.Latitude,
        Longitude = raw.Location?.Longitude,
        NationalPhoneNumber = raw.NationalPhoneNumber,
        WebsiteUri = raw.WebsiteUri,
        RegularOpeningHours = raw.RegularOpeningHours,
        Rating = raw.Rating,
        UserRatingCount = raw.UserRatingCount,
        Types = raw.Types ?? [],
        BusinessStatus = raw.BusinessStatus,
        EditorialSummary = raw.EditorialSummary?.Text,
        Photos = raw.Photos,
    };
}
