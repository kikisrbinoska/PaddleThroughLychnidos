using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Review.Queries
{
    public class GetHandler : IRequestHandler<GetRequest, List<GetResponse>>
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserRepository _userRepository;

        public GetHandler(IReviewRepository reviewRepository, IUserRepository userRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
        }

        public async Task<List<GetResponse>> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var reviews = await _reviewRepository.GetAllAsync();

            var query = reviews.AsEnumerable();

            if (request.ShopId.HasValue)
            {
                query = query.Where(r => r.ShopId == request.ShopId.Value);
            }

            if (request.UserId.HasValue)
            {
                query = query.Where(r => r.UserId == request.UserId.Value);
            }

            var filtered = query.ToList();

            var users = await _userRepository.GetUsersByIdsAsync(filtered.Select(r => r.UserId).Distinct());
            var usernamesById = users.ToDictionary(u => u.Id, u => u.Username);

            return filtered
                .Select(review => new GetResponse
                {
                    Id = review.Id,
                    UserId = review.UserId,
                    UserName = usernamesById.GetValueOrDefault(review.UserId, "Unknown"),
                    ShopId = review.ShopId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                })
                .ToList();
        }
    }
}
