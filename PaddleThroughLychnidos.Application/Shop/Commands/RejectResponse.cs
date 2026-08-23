namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class RejectResponse
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string RejectionReason { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
