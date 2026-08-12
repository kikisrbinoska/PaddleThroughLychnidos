using MediatR;
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
            _ = await _userRepository.GetByIdAsync(request.OwnerId)
                ?? throw new PaddleThroughLychnidosException("Owner not found", HttpStatusCode.NotFound);

            _ = await _regionRepository.GetByIdAsync(request.RegionId)
                ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);

            _ = await _categoryRepository.GetByIdAsync(request.CategoryId)
                ?? throw new PaddleThroughLychnidosException("Category not found", HttpStatusCode.NotFound);

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
                WhatsappNumber = request.WhatsappNumber,
                Email = request.Email,
                InstagramHandle = request.InstagramHandle,
                IsVerified = false,
                OpeningHours = request.OpeningHours,
            };

            await _shopRepository.AddAsync(shop);

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
                WhatsappNumber = shop.WhatsappNumber,
                Email = shop.Email,
                InstagramHandle = shop.InstagramHandle,
                IsVerified = shop.IsVerified,
                OpeningHours = shop.OpeningHours,
                Message = "Shop created successfully",
            };
        }
    }
}
