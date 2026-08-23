using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
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

            if (shop.Status != ShopStatus.Approved)
            {
                var isOwner = request.RequestingUserId.HasValue && shop.OwnerId == request.RequestingUserId.Value;
                var requestingUser = request.RequestingUserId.HasValue
                    ? await _userRepository.GetByIdAsync(request.RequestingUserId.Value)
                    : null;
                var isAdmin = requestingUser?.Role == UserRole.Administrator;

                if (!isOwner && !isAdmin)
                {
                    // Not-yet-approved shops don't exist as far as the
                    // public is concerned - a 404 (not 403) avoids leaking
                    // that a shop with this id exists at all.
                    throw new PaddleThroughLychnidosException($"Shop with Id {request.Id} not found.", HttpStatusCode.NotFound);
                }
            }
            else
            {
                // Simple view counter, per task scope - only counts views
                // of live/Approved shops, not the owner previewing their
                // own Pending listing.
                shop.ViewCount += 1;
                await _shopRepository.UpdateAsync(shop);
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
                Email = shop.Email,
                InstagramHandle = shop.InstagramHandle,
                Website = shop.Website,
                Rating = shop.Rating,
                UserRatingCount = shop.UserRatingCount,
                IsVerified = shop.IsVerified,
                OpeningHours = shop.OpeningHours,
                IsOpenNow = OpenNowCalculator.IsOpenAt(shop.StructuredHoursJson, DateTimeOffset.Now),
                Status = shop.Status.ToString(),
            };
        }
    }
}
