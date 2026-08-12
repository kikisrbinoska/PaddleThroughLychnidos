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

        public AddHandler(IReviewRepository reviewRepository, IUserRepository userRepository, IShopRepository shopRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
            _shopRepository = shopRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            _ = await _userRepository.GetByIdAsync(request.UserId)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            _ = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            var review = new Domain.Entities.Review
            {
                UserId = request.UserId,
                ShopId = request.ShopId,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow,
            };

            await _reviewRepository.AddAsync(review);

            return new AddResponse
            {
                Id = review.Id,
                UserId = review.UserId,
                ShopId = review.ShopId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                Message = "Review created successfully",
            };
        }
    }
}
