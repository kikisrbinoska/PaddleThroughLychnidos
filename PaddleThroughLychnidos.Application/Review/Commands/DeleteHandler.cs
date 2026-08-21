using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IReviewRepository _reviewRepository;

        public DeleteHandler(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var review = await _reviewRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Review not found", HttpStatusCode.NotFound);

            if (review.UserId != request.UserId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to delete this review", HttpStatusCode.Forbidden);
            }

            // Passport stamps are intentionally NOT removed here - the
            // stamp represents that the visit happened, which stays true
            // even if the written review is later deleted.
            await _reviewRepository.DeleteAsync(review);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Review deleted successfully",
            };
        }
    }
}
