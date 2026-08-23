using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetByOwnerIdHandler : IRequestHandler<GetByOwnerIdRequest, GetByOwnerIdResponse>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IVerificationRequestRepository _verificationRequestRepository;

        public GetByOwnerIdHandler(
            IShopRepository shopRepository,
            IReviewRepository reviewRepository,
            IVerificationRequestRepository verificationRequestRepository)
        {
            _shopRepository = shopRepository;
            _reviewRepository = reviewRepository;
            _verificationRequestRepository = verificationRequestRepository;
        }

        public async Task<GetByOwnerIdResponse> Handle(GetByOwnerIdRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByOwnerIdAsync(request.OwnerId);
            if (shop is null)
            {
                return new GetByOwnerIdResponse { Shop = null };
            }

            var savedCount = await _shopRepository.GetSavedCountAsync(shop.Id);
            var (reviewCount, _) = await _reviewRepository.GetPagedAsync(pageNumber: null, pageSize: null, shopId: shop.Id, userId: null);
            var pendingVerification = await _verificationRequestRepository.GetPendingByShopIdAsync(shop.Id);

            return new GetByOwnerIdResponse
            {
                Shop = new OwnedShopDto
                {
                    Id = shop.Id,
                    Name = shop.Name,
                    Description = shop.Description,
                    Story = shop.Story,
                    Latitude = shop.Latitude,
                    Longitude = shop.Longitude,
                    Address = shop.Address,
                    RegionId = shop.RegionId,
                    RegionName = shop.Region?.Name ?? "Unassigned",
                    CategoryId = shop.CategoryId,
                    CategoryName = shop.Category.Name,
                    PhoneNumber = shop.PhoneNumber,
                    Email = shop.Email,
                    InstagramHandle = shop.InstagramHandle,
                    Website = shop.Website,
                    Rating = shop.Rating,
                    UserRatingCount = shop.UserRatingCount,
                    IsVerified = shop.IsVerified,
                    OpeningHours = shop.OpeningHours,
                    Status = shop.Status.ToString(),
                    RejectionReason = shop.RejectionReason,
                    ViewCount = shop.ViewCount,
                    SavedCount = savedCount,
                    ReviewCount = reviewCount,
                    ImageUrls = shop.Images.Select(i => i.Url).ToList(),
                    HasPendingVerificationRequest = pendingVerification is not null,
                },
            };
        }
    }
}
