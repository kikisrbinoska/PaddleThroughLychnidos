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
            var shops = await _shopRepository.GetByOwnerIdAsync(request.OwnerId);

            var dtos = new List<OwnedShopDto>();
            foreach (var shop in shops)
            {
                dtos.Add(await OwnedShopMapper.ToDto(shop, _shopRepository, _reviewRepository, _verificationRequestRepository));
            }

            return new GetByOwnerIdResponse { Shops = dtos };
        }
    }

    /// <summary>Shared OwnedShopDto builder used by both GetByOwnerIdHandler (list) and GetOwnedByIdHandler (single, id-scoped).</summary>
    internal static class OwnedShopMapper
    {
        public static async Task<OwnedShopDto> ToDto(
            Domain.Entities.Shop shop,
            IShopRepository shopRepository,
            IReviewRepository reviewRepository,
            IVerificationRequestRepository verificationRequestRepository)
        {
            var savedCount = await shopRepository.GetSavedCountAsync(shop.Id);
            var (reviewCount, _) = await reviewRepository.GetPagedAsync(pageNumber: null, pageSize: null, shopId: shop.Id, userId: null);
            var pendingVerification = await verificationRequestRepository.GetPendingByShopIdAsync(shop.Id);

            return new OwnedShopDto
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
                StructuredHoursJson = shop.StructuredHoursJson,
                Status = shop.Status.ToString(),
                RejectionReason = shop.RejectionReason,
                ViewCount = shop.ViewCount,
                SavedCount = savedCount,
                ReviewCount = reviewCount,
                Images = shop.Images.Select(i => new OwnedShopImageDto { Id = i.Id, Url = i.Url }).ToList(),
                HasPendingVerificationRequest = pendingVerification is not null,
                MembershipTier = shop.MembershipTier.ToString(),
                MembershipActivatedAt = shop.MembershipActivatedAt,
            };
        }
    }
}
