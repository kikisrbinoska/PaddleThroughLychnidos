namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class EditResponse
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Story { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; } = string.Empty;
        public int RegionId { get; set; }
        public int CategoryId { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string WhatsappNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string InstagramHandle { get; set; } = string.Empty;
        public bool IsVerified { get; set; }
        public string OpeningHours { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
