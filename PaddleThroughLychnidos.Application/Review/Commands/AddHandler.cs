using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserRepository _userRepository;
        private readonly IShopRepository _shopRepository;
        private readonly IPassportStampRepository _passportStampRepository;

        public AddHandler(
            IReviewRepository reviewRepository,
            IUserRepository userRepository,
            IShopRepository shopRepository,
            IPassportStampRepository passportStampRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
            _shopRepository = shopRepository;
            _passportStampRepository = passportStampRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            _ = await _userRepository.GetByIdAsync(request.UserId)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            _ = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            var existingReview = await _reviewRepository.GetByUserAndShopAsync(request.UserId, request.ShopId);
            if (existingReview is not null)
            {
                throw new PaddleThroughLychnidosException(
                    $"You've already reviewed this shop. Edit your existing review (Id {existingReview.Id}) instead.",
                    HttpStatusCode.Conflict);
            }

            var review = new Domain.Entities.Review
            {
                UserId = request.UserId,
                ShopId = request.ShopId,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow,
            };

            await _reviewRepository.AddAsync(review);

            // A review is our proxy for "visited" - award a stamp the first
            // time this user reviews this shop. One stamp per (user, shop),
            // enforced by GetByUserAndShopAsync plus a unique index as a
            // backstop against a race between the check and the insert.
            var existingStamp = await _passportStampRepository.GetByUserAndShopAsync(request.UserId, request.ShopId);
            var isNewStamp = existingStamp is null;

            if (isNewStamp)
            {
                await _passportStampRepository.AddAsync(new Domain.Entities.PassportStamp
                {
                    UserId = request.UserId,
                    ShopId = request.ShopId,
                    VisitedAt = DateTime.UtcNow,
                });
            }

            return new AddResponse
            {
                Id = review.Id,
                UserId = review.UserId,
                ShopId = review.ShopId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                IsNewStamp = isNewStamp,
                Message = isNewStamp
                    ? "Review created successfully - you earned a new passport stamp!"
                    : "Review created successfully",
            };
        }
    }
}
