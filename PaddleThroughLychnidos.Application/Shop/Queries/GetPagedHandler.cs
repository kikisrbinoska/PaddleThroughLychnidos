using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetPagedHandler : IRequestHandler<GetPagedRequest, GetPagedResponse>
    {
        private readonly IShopRepository _shopRepository;

        public GetPagedHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<GetPagedResponse> Handle(GetPagedRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _shopRepository.GetPagedAsync(pageNumber, pageSize, request.SearchWord, request.CategoryId, request.RegionId);

            var items = list
                .Select(shop => new ShopListItem
                {
                    Id = shop.Id,
                    OwnerId = shop.OwnerId,
                    Name = shop.Name,
                    Description = shop.Description,
                    Latitude = shop.Latitude,
                    Longitude = shop.Longitude,
                    Address = shop.Address,
                    RegionId = shop.RegionId,
                    RegionName = shop.Region?.Name ?? "Unassigned",
                    CategoryId = shop.CategoryId,
                    CategoryName = shop.Category.Name,
                    ImageUrl = shop.Images.Select(i => i.Url).FirstOrDefault() ?? string.Empty,
                    Rating = shop.Rating,
                    UserRatingCount = shop.UserRatingCount,
                    IsVerified = shop.IsVerified,
                    OpeningHours = shop.OpeningHours,
                    IsOpenNow = OpenNowCalculator.IsOpenAt(shop.StructuredHoursJson, DateTimeOffset.Now),
                })
                .ToList();

            var totalPages = (int)Math.Ceiling(count / (double)pageSize);

            return new GetPagedResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
