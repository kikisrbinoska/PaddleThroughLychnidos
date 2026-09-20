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

        // Structured day/open/close windows from the artisan-facing hours
        // picker, serialized the same way as Shop.StructuredHoursJson (a
        // JSON array of Domain.Shared.WeeklyHoursEntry). Null/empty when
        // the artisan hasn't set structured hours - OpeningHours above is
        // still required as the free-text fallback shown everywhere else.
        public string? StructuredHoursJson { get; set; }

        // Photos attached during creation, already uploaded via
        // POST /api/artisan/shop-images beforehand (that endpoint exists
        // precisely because a shop has no id yet at this point) - handler
        // attaches these as ShopImage rows once the shop id is known.
        public List<string> ImageUrls { get; set; } = new();
    }
}
