using MediatR;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class RejectRequest : IRequest<RejectResponse>
    {
        public int RequestId { get; set; }
        public int AdminId { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
