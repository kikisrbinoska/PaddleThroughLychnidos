namespace PaddleThroughLychnidos.Application.VerificationRequest.Queries
{
    public class PendingVerificationDto
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public string ShopName { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<string> DocumentUrls { get; set; } = new();
        public string Status { get; set; } = string.Empty;
        public string? ReviewedByAdminName { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? RejectionReason { get; set; }
    }

    public class GetPendingResponse
    {
        public List<PendingVerificationDto> Items { get; set; } = new();
    }
}
