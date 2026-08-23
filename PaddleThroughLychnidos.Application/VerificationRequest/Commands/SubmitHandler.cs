using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Text.Json;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class SubmitHandler : IRequestHandler<SubmitRequest, SubmitResponse>
    {
        private readonly IVerificationRequestRepository _verificationRequestRepository;
        private readonly IShopRepository _shopRepository;

        public SubmitHandler(IVerificationRequestRepository verificationRequestRepository, IShopRepository shopRepository)
        {
            _verificationRequestRepository = verificationRequestRepository;
            _shopRepository = shopRepository;
        }

        public async Task<SubmitResponse> Handle(SubmitRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            if (shop.OwnerId != request.OwnerId)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to request verification for this shop", HttpStatusCode.Forbidden);
            }

            if (shop.Status != ShopStatus.Approved)
            {
                throw new PaddleThroughLychnidosException("Your shop must be approved before you can request verification", HttpStatusCode.BadRequest);
            }

            if (shop.IsVerified)
            {
                throw new PaddleThroughLychnidosException("This shop is already verified", HttpStatusCode.BadRequest);
            }

            var existingPending = await _verificationRequestRepository.GetPendingByShopIdAsync(request.ShopId);
            if (existingPending is not null)
            {
                throw new PaddleThroughLychnidosException("A verification request for this shop is already under review", HttpStatusCode.Conflict);
            }

            var verificationRequest = new Domain.Entities.VerificationRequest
            {
                ShopId = request.ShopId,
                SubmittedAt = DateTime.UtcNow,
                Status = VerificationStatus.Pending,
                Notes = request.Notes,
                DocumentUrlsJson = JsonSerializer.Serialize(request.DocumentUrls),
            };

            await _verificationRequestRepository.AddAsync(verificationRequest);

            return new SubmitResponse
            {
                Id = verificationRequest.Id,
                ShopId = verificationRequest.ShopId,
                Status = verificationRequest.Status.ToString(),
                SubmittedAt = verificationRequest.SubmittedAt,
                Message = "Your verification request has been submitted for review.",
            };
        }
    }
}
