using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IRegionRepository _regionRepository;
        private readonly ICategoryRepository _categoryRepository;

        public EditHandler(IShopRepository shopRepository, IRegionRepository regionRepository, ICategoryRepository categoryRepository)
        {
            _shopRepository = shopRepository;
            _regionRepository = regionRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            _ = await _regionRepository.GetByIdAsync(request.RegionId)
                ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);

            _ = await _categoryRepository.GetByIdAsync(request.CategoryId)
                ?? throw new PaddleThroughLychnidosException("Category not found", HttpStatusCode.NotFound);

            shop.Name = request.Name;
            shop.Description = request.Description;
            shop.Story = request.Story;
            shop.Latitude = request.Latitude;
            shop.Longitude = request.Longitude;
            shop.Address = request.Address;
            shop.RegionId = request.RegionId;
            shop.CategoryId = request.CategoryId;
            shop.PhoneNumber = request.PhoneNumber;
            shop.WhatsappNumber = request.WhatsappNumber;
            shop.Email = request.Email;
            shop.InstagramHandle = request.InstagramHandle;
            shop.OpeningHours = request.OpeningHours;

            await _shopRepository.UpdateAsync(shop);

            return new EditResponse
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
                Message = "Shop updated successfully",
            };
        }
    }
}
