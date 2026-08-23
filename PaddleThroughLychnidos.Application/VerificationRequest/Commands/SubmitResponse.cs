namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class SubmitResponse
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
