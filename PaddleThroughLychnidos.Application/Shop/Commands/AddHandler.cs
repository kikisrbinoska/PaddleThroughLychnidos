using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRegionRepository _regionRepository;
        private readonly ICategoryRepository _categoryRepository;

        public AddHandler(
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

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            var owner = await _userRepository.GetByIdAsync(request.OwnerId)
                ?? throw new PaddleThroughLychnidosException("Owner not found", HttpStatusCode.NotFound);

            if (request.RegionId.HasValue)
            {
                _ = await _regionRepository.GetByIdAsync(request.RegionId.Value)
                    ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);
            }

            _ = await _categoryRepository.GetByIdAsync(request.CategoryId)
                ?? throw new PaddleThroughLychnidosException("Category not found", HttpStatusCode.NotFound);

            // Artisan-created shops start Pending and stay invisible in
            // public listings until an admin approves them (see
            // ShopRepository.GetPagedAsync). Shops created any other way
            // (e.g. a future admin-created flow) default to Approved,
            // matching how bulk-imported shops already behave.
            var status = owner.Role == UserRole.Artisan ? ShopStatus.Pending : ShopStatus.Approved;

            var shop = new Domain.Entities.Shop
            {
                OwnerId = request.OwnerId,
                Name = request.Name,
                Description = request.Description,
                Story = request.Story,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Address = request.Address,
                RegionId = request.RegionId,
                CategoryId = request.CategoryId,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                InstagramHandle = request.InstagramHandle,
                Website = request.Website,
                IsVerified = false,
                OpeningHours = request.OpeningHours,
                StructuredHoursJson = request.StructuredHoursJson,
                Status = status,
                CreatedAt = DateTime.UtcNow,
            };

            await _shopRepository.AddAsync(shop);

            foreach (var url in request.ImageUrls)
            {
                shop.Images.Add(new Domain.Entities.ShopImage { ShopId = shop.Id, Url = url });
            }

            if (request.ImageUrls.Count > 0)
            {
                await _shopRepository.UpdateAsync(shop);
            }

            return new AddResponse
            {
                Id = shop.Id,
                OwnerId = shop.OwnerId,
                Name = shop.Name,
                Description = shop.Description,
                Story = shop.Story,
                Latitude = shop.Latitude,
                Longitude = shop.Longitude,
                Address = shop.Address,
                RegionId = shop.RegionId,
                CategoryId = shop.CategoryId,
                PhoneNumber = shop.PhoneNumber,
                Email = shop.Email,
                InstagramHandle = shop.InstagramHandle,
                Website = shop.Website,
                IsVerified = shop.IsVerified,
                OpeningHours = shop.OpeningHours,
                Status = shop.Status.ToString(),
                Message = status == ShopStatus.Pending
                    ? "Your shop has been submitted for review and will be visible to visitors once approved, usually within 2-3 business days."
                    : "Shop created successfully",
            };
        }
    }
}
