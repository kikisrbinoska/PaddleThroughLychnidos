using MediatR;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class ApproveRequest : IRequest<ApproveResponse>
    {
        public int RequestId { get; set; }
        public int AdminId { get; set; }
    }
}
