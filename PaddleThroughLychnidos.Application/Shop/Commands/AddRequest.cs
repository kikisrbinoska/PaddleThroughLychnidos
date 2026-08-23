using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class AddRequest : IRequest<AddResponse>
    {
        // Never trust a client-supplied value here - the controller
        // overwrites this from the authenticated user's JWT claims before
        // dispatching (see ShopsController.Add / ArtisanController.Add).
        public int OwnerId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Story { get; set; } = string.Empty;

        // Optional for artisan-created shops (an artisan may not know
        // precise coordinates or address up front) - defaults to 0/empty,
        // same as how imported shops that lack a region are left
        // unassigned. Admin/import flows can still supply real values.
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
    }
}
