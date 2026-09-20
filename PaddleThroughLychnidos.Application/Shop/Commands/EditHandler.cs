using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRegionRepository _regionRepository;
        private readonly ICategoryRepository _categoryRepository;

        public EditHandler(
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

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            var requestingUser = await _userRepository.GetByIdAsync(request.RequestingUserId)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            var isOwner = shop.OwnerId == request.RequestingUserId;
            var isAdmin = requestingUser.Role == UserRole.Administrator;
            if (!isOwner && !isAdmin)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to edit this shop", HttpStatusCode.Forbidden);
            }

            if (request.RegionId.HasValue)
            {
                _ = await _regionRepository.GetByIdAsync(request.RegionId.Value)
                    ?? throw new PaddleThroughLychnidosException("Region not found", HttpStatusCode.NotFound);
            }

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
            shop.Email = request.Email;
            shop.InstagramHandle = request.InstagramHandle;
            shop.Website = request.Website;
            shop.OpeningHours = request.OpeningHours;
            shop.StructuredHoursJson = request.StructuredHoursJson;

            // Editing does NOT change Status - a Rejected shop stays
            // Rejected until the artisan explicitly resubmits (see
            // Shop.Commands.ResubmitHandler), so they can fix multiple
            // issues before going back into the review queue.

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
                Email = shop.Email,
                InstagramHandle = shop.InstagramHandle,
                Website = shop.Website,
                IsVerified = shop.IsVerified,
                OpeningHours = shop.OpeningHours,
                Status = shop.Status.ToString(),
                Message = "Shop updated successfully",
            };
        }
    }
}
