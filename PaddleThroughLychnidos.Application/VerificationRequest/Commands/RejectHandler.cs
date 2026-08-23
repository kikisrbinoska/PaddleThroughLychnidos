using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class RejectHandler : IRequestHandler<RejectRequest, RejectResponse>
    {
        private readonly IVerificationRequestRepository _verificationRequestRepository;

        public RejectHandler(IVerificationRequestRepository verificationRequestRepository)
        {
            _verificationRequestRepository = verificationRequestRepository;
        }

        public async Task<RejectResponse> Handle(RejectRequest request, CancellationToken cancellationToken)
        {
            var verificationRequest = await _verificationRequestRepository.GetByIdAsync(request.RequestId)
                ?? throw new PaddleThroughLychnidosException("Verification request not found", HttpStatusCode.NotFound);

            verificationRequest.Status = VerificationStatus.Rejected;
            verificationRequest.ReviewedByAdminId = request.AdminId;
            verificationRequest.ReviewedAt = DateTime.UtcNow;
            verificationRequest.RejectionReason = request.Reason;

            await _verificationRequestRepository.UpdateAsync(verificationRequest);

            return new RejectResponse
            {
                Id = verificationRequest.Id,
                ShopId = verificationRequest.ShopId,
                Status = verificationRequest.Status.ToString(),
                Message = "Verification request rejected",
            };
        }
    }
}
