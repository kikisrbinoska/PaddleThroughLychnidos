using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class EditRequest : IRequest<EditResponse>
    {
        public int Id { get; set; }

        // Never trust a client-supplied value here - the controller
        // overwrites this from the authenticated user's JWT claims before
        // dispatching. Used to verify the requester owns this shop.
        public int RequestingUserId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Story { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; } = string.Empty;
        public int? RegionId { get; set; }
        public int CategoryId { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string InstagramHandle { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string OpeningHours { get; set; } = string.Empty;

        // See AddRequest.StructuredHoursJson - same shape, same optionality.
        public string? StructuredHoursJson { get; set; }
    }
}
