using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Review.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserRepository _userRepository;
        private readonly IShopRepository _shopRepository;

        public GetByIdHandler(IReviewRepository reviewRepository, IUserRepository userRepository, IShopRepository shopRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
            _shopRepository = shopRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var review = await _reviewRepository.GetByIdAsync(request.Id);
            if (review == null)
            {
                throw new PaddleThroughLychnidosException($"Review with Id {request.Id} not found.", HttpStatusCode.NotFound);
            }

            var user = await _userRepository.GetByIdAsync(review.UserId);
            var shop = await _shopRepository.GetByIdAsync(review.ShopId);

            return new GetByIdResponse
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = user?.Username ?? "Unknown",
                ShopId = review.ShopId,
                ShopName = shop?.Name ?? "Unknown",
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
            };
        }
    }
}
