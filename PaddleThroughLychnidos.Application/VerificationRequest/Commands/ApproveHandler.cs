using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class ApproveHandler : IRequestHandler<ApproveRequest, ApproveResponse>
    {
        private readonly IVerificationRequestRepository _verificationRequestRepository;
        private readonly IShopRepository _shopRepository;

        public ApproveHandler(IVerificationRequestRepository verificationRequestRepository, IShopRepository shopRepository)
        {
            _verificationRequestRepository = verificationRequestRepository;
            _shopRepository = shopRepository;
        }

        public async Task<ApproveResponse> Handle(ApproveRequest request, CancellationToken cancellationToken)
        {
            var verificationRequest = await _verificationRequestRepository.GetByIdAsync(request.RequestId)
                ?? throw new PaddleThroughLychnidosException("Verification request not found", HttpStatusCode.NotFound);

            var shop = await _shopRepository.GetByIdAsync(verificationRequest.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            verificationRequest.Status = VerificationStatus.Approved;
            verificationRequest.ReviewedByAdminId = request.AdminId;
            verificationRequest.ReviewedAt = DateTime.UtcNow;

            shop.IsVerified = true;

            await _verificationRequestRepository.UpdateAsync(verificationRequest);
            await _shopRepository.UpdateAsync(shop);

            return new ApproveResponse
            {
                Id = verificationRequest.Id,
                ShopId = verificationRequest.ShopId,
                Status = verificationRequest.Status.ToString(),
                Message = "Verification approved - shop is now verified.",
            };
        }
    }
}
