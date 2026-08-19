using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Text.Json;

namespace PaddleThroughLychnidos.Application.ShopImport.Commands
{
    public class ImportOhridShopsHandler : IRequestHandler<ImportOhridShopsRequest, ImportOhridShopsResponse>
    {
        private const double DuplicateRadiusMeters = 50;

        private readonly IShopRepository _shopRepository;
        private readonly ICategoryRepository _categoryRepository;

        public ImportOhridShopsHandler(IShopRepository shopRepository, ICategoryRepository categoryRepository)
        {
            _shopRepository = shopRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<ImportOhridShopsResponse> Handle(ImportOhridShopsRequest request, CancellationToken cancellationToken)
        {
            if (!File.Exists(request.FilePath))
            {
                throw new PaddleThroughLychnidosException($"Import file not found: {request.FilePath}", HttpStatusCode.NotFound);
            }

            var json = await File.ReadAllTextAsync(request.FilePath, cancellationToken);
            var records = JsonSerializer.Deserialize<List<OhridShopImportRecord>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            }) ?? new List<OhridShopImportRecord>();

            var categories = (await _categoryRepository.GetAllAsync()).ToList();
            var categoryByName = categories.ToDictionary(c => c.Name, c => c.Id, StringComparer.OrdinalIgnoreCase);

            var existingShops = (await _shopRepository.GetAllAsync()).ToList();

            var response = new ImportOhridShopsResponse
            {
                TotalRead = records.Count,
            };

            foreach (var record in records)
            {
                if (!string.Equals(record.BusinessStatus, "OPERATIONAL", StringComparison.OrdinalIgnoreCase))
                {
                    response.TotalSkippedNotOperational++;
                    response.Warnings.Add($"Skipped '{record.Name}': businessStatus is '{record.BusinessStatus}', not OPERATIONAL.");
                    continue;
                }

                var isDuplicate = existingShops.Any(s =>
                    string.Equals(s.Name, record.Name, StringComparison.OrdinalIgnoreCase) &&
                    DistanceInMeters(s.Latitude, s.Longitude, record.Lat, record.Lng) <= DuplicateRadiusMeters);

                if (isDuplicate)
                {
                    response.TotalSkippedDuplicates++;
                    response.Warnings.Add($"Skipped '{record.Name}': duplicate of an existing shop (same name, within {DuplicateRadiusMeters}m).");
                    continue;
                }

                var matchedCategoryNames = (record.MatchedCategories ?? string.Empty)
                    .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .ToList();

                if (matchedCategoryNames.Count == 0)
                {
                    response.TotalSkippedMissingCategory++;
                    response.Warnings.Add($"Skipped '{record.Name}': no matchedCategories value.");
                    continue;
                }

                if (matchedCategoryNames.Count > 1)
                {
                    response.ShopsWithMultipleCategories.Add($"{record.Name}: {string.Join(", ", matchedCategoryNames)}");
                }

                var primaryCategoryName = matchedCategoryNames[0];

                if (!categoryByName.TryGetValue(primaryCategoryName, out var categoryId))
                {
                    response.TotalSkippedMissingCategory++;
                    response.Warnings.Add($"Skipped '{record.Name}': no Category found matching '{primaryCategoryName}'.");
                    continue;
                }

                var shop = new Domain.Entities.Shop
                {
                    OwnerId = null,
                    RegionId = null,
                    CategoryId = categoryId,
                    Name = record.Name,
                    Address = record.FormattedAddress,
                    PhoneNumber = record.Phone ?? string.Empty,
                    Website = record.Website,
                    Rating = record.Rating,
                    UserRatingCount = record.UserRatingCount.HasValue ? (int)record.UserRatingCount.Value : null,
                    Latitude = record.Lat,
                    Longitude = record.Lng,
                    IsVerified = false,
                };

                await _shopRepository.AddAsync(shop);
                existingShops.Add(shop);
                response.TotalInserted++;
            }

            return response;
        }

        private static double DistanceInMeters(double lat1, double lon1, double lat2, double lon2)
        {
            const double earthRadiusMeters = 6371000;

            var dLat = DegreesToRadians(lat2 - lat1);
            var dLon = DegreesToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return earthRadiusMeters * c;
        }

        private static double DegreesToRadians(double degrees) => degrees * Math.PI / 180;
    }
}
