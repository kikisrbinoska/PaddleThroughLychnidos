using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Queries
{
    public class GetPendingRequest : IRequest<GetPendingResponse>
    {
        /// <summary>Defaults to Pending when omitted - Approved/Rejected show the review history.</summary>
        public VerificationStatus? Status { get; set; }
    }
}
