using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Admin.Queries
{
    public class GetDashboardStatsHandler : IRequestHandler<GetDashboardStatsRequest, GetDashboardStatsResponse>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IUserRepository _userRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IItineraryRepository _itineraryRepository;
        private readonly IVerificationRequestRepository _verificationRequestRepository;

        public GetDashboardStatsHandler(
            IShopRepository shopRepository,
            IUserRepository userRepository,
            IReviewRepository reviewRepository,
            IItineraryRepository itineraryRepository,
            IVerificationRequestRepository verificationRequestRepository)
        {
            _shopRepository = shopRepository;
            _userRepository = userRepository;
            _reviewRepository = reviewRepository;
            _itineraryRepository = itineraryRepository;
            _verificationRequestRepository = verificationRequestRepository;
        }

        public async Task<GetDashboardStatsResponse> Handle(GetDashboardStatsRequest request, CancellationToken cancellationToken)
        {
            return new GetDashboardStatsResponse
            {
                PendingShops = await _shopRepository.GetCountByStatusAsync(ShopStatus.Pending),
                ApprovedShops = await _shopRepository.GetCountByStatusAsync(ShopStatus.Approved),
                RejectedShops = await _shopRepository.GetCountByStatusAsync(ShopStatus.Rejected),
                TotalShops = await _shopRepository.GetTotalNumberAsync(),

                VerifiedArtisans = await _shopRepository.GetVerifiedCountAsync(),
                PendingVerificationRequests = await _verificationRequestRepository.GetCountByStatusAsync(VerificationStatus.Pending),

                TotalUsers = await _userRepository.GetTotalCountAsync(),
                RegularUsers = await _userRepository.GetCountByRoleAsync(UserRole.RegularUser),
                Artisans = await _userRepository.GetCountByRoleAsync(UserRole.Artisan),
                Administrators = await _userRepository.GetCountByRoleAsync(UserRole.Administrator),

                TotalReviews = await _reviewRepository.GetTotalCountAsync(),
                TotalItineraries = await _itineraryRepository.GetTotalCountAsync(),
            };
        }
    }
}
