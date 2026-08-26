using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Review.Queries
{
    public class GetHandler : IRequestHandler<GetRequest, GetResponse>
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserRepository _userRepository;
        private readonly IShopRepository _shopRepository;

        public GetHandler(IReviewRepository reviewRepository, IUserRepository userRepository, IShopRepository shopRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
            _shopRepository = shopRepository;
        }

        public async Task<GetResponse> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _reviewRepository.GetPagedAsync(pageNumber, pageSize, request.ShopId, request.UserId);

            var users = await _userRepository.GetUsersByIdsAsync(list.Select(r => r.UserId).Distinct());
            var usernamesById = users.ToDictionary(u => u.Id, u => u.Username);

            var shops = await _shopRepository.GetByIdsAsync(list.Select(r => r.ShopId).Distinct());
            var shopNamesById = shops.ToDictionary(s => s.Id, s => s.Name);

            var items = list
                .Select(review => new ReviewListItemDto
                {
                    Id = review.Id,
                    UserId = review.UserId,
                    UserName = usernamesById.GetValueOrDefault(review.UserId, "Unknown"),
                    ShopId = review.ShopId,
                    ShopName = shopNamesById.GetValueOrDefault(review.ShopId, "Unknown shop"),
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                })
                .ToList();

            var totalPages = (int)Math.Ceiling(count / (double)pageSize);

            return new GetResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
