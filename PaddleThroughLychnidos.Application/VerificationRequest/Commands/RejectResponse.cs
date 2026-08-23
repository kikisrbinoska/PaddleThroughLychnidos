namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class RejectResponse
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
