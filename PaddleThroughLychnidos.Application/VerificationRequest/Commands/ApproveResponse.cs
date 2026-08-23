namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class ApproveResponse
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
