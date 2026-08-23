using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using System.Text.Json;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Queries
{
    public class GetPendingHandler : IRequestHandler<GetPendingRequest, GetPendingResponse>
    {
        private readonly IVerificationRequestRepository _verificationRequestRepository;

        public GetPendingHandler(IVerificationRequestRepository verificationRequestRepository)
        {
            _verificationRequestRepository = verificationRequestRepository;
        }

        public async Task<GetPendingResponse> Handle(GetPendingRequest request, CancellationToken cancellationToken)
        {
            var status = request.Status ?? VerificationStatus.Pending;
            var requests = await _verificationRequestRepository.GetPagedByStatusAsync(status);

            var items = requests
                .Select(r => new PendingVerificationDto
                {
                    Id = r.Id,
                    ShopId = r.ShopId,
                    ShopName = r.Shop.Name,
                    OwnerName = r.Shop.Owner?.Name ?? "Unknown",
                    CategoryName = r.Shop.Category.Name,
                    SubmittedAt = r.SubmittedAt,
                    Notes = r.Notes,
                    DocumentUrls = JsonSerializer.Deserialize<List<string>>(r.DocumentUrlsJson) ?? new(),
                    Status = r.Status.ToString(),
                    ReviewedByAdminName = r.ReviewedByAdmin?.Name,
                    ReviewedAt = r.ReviewedAt,
                    RejectionReason = r.RejectionReason,
                })
                .ToList();

            return new GetPendingResponse { Items = items };
        }
    }
}
