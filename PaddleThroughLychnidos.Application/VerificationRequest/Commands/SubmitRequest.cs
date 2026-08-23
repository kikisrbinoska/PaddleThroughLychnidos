using MediatR;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class SubmitRequest : IRequest<SubmitResponse>
    {
        public int ShopId { get; set; }
        public int OwnerId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<string> DocumentUrls { get; set; } = new();
    }
}
