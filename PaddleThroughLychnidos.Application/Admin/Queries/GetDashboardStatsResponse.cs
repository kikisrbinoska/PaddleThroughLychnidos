namespace PaddleThroughLychnidos.Application.Admin.Queries
{
    public class GetDashboardStatsResponse
    {
        public int TotalShops { get; set; }
        public int PendingShops { get; set; }
        public int ApprovedShops { get; set; }
        public int RejectedShops { get; set; }

        public int VerifiedArtisans { get; set; }
        public int PendingVerificationRequests { get; set; }

        public int TotalUsers { get; set; }
        public int RegularUsers { get; set; }
        public int Artisans { get; set; }
        public int Administrators { get; set; }

        public int TotalReviews { get; set; }
        public int TotalItineraries { get; set; }
    }
}
