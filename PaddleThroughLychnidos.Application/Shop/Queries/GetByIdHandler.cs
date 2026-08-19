using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRegionRepository _regionRepository;
        private readonly ICategoryRepository _categoryRepository;

        public GetByIdHandler(
            IShopRepository shopRepository,
            IUserRepository userRepository,
            IRegionRepository regionRepository,
            ICategoryRepository categoryRepository)
        {
            _shopRepository = shopRepository;
            _userRepository = userRepository;
            _regionRepository = regionRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.Id);
            if (shop == null)
            {
                throw new PaddleThroughLychnidosException($"Shop with Id {request.Id} not found.", HttpStatusCode.NotFound);
            }

            var owner = shop.OwnerId.HasValue ? await _userRepository.GetByIdAsync(shop.OwnerId.Value) : null;
            var region = shop.RegionId.HasValue ? await _regionRepository.GetByIdAsync(shop.RegionId.Value) : null;
            var category = await _categoryRepository.GetByIdAsync(shop.CategoryId);

            return new GetByIdResponse
            {
                Id = shop.Id,
                OwnerId = shop.OwnerId,
                OwnerName = owner?.Name ?? "Unknown",
                Name = shop.Name,
                Description = shop.Description,
                Story = shop.Story,
                Latitude = shop.Latitude,
                Longitude = shop.Longitude,
                Address = shop.Address,
                RegionId = shop.RegionId,
                RegionName = region?.Name ?? "Unassigned",
                CategoryId = shop.CategoryId,
                CategoryName = category?.Name ?? "Unknown",
                PhoneNumber = shop.PhoneNumber,
                WhatsappNumber = shop.WhatsappNumber,
                Email = shop.Email,
                InstagramHandle = shop.InstagramHandle,
                Website = shop.Website,
                Rating = shop.Rating,
                UserRatingCount = shop.UserRatingCount,
                IsVerified = shop.IsVerified,
                OpeningHours = shop.OpeningHours,
                IsOpenNow = OpenNowCalculator.IsOpenAt(shop.StructuredHoursJson, DateTimeOffset.Now),
            };
        }
    }
}
