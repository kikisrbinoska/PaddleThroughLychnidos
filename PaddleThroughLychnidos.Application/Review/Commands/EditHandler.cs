using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IReviewRepository _reviewRepository;

        public EditHandler(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var review = await _reviewRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Review not found", HttpStatusCode.NotFound);

            review.Rating = request.Rating;
            review.Comment = request.Comment;

            await _reviewRepository.UpdateAsync(review);

            return new EditResponse
            {
                Id = review.Id,
                UserId = review.UserId,
                ShopId = review.ShopId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                Message = "Review updated successfully",
            };
        }
    }
}
