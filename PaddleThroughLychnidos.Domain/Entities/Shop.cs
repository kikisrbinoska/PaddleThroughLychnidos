using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class Shop : IEntity
    {
        public int Id { get; set; }
        public int? OwnerId { get; set; }
        public User? Owner { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Story { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; } = string.Empty;

        public int? RegionId { get; set; }
        public Region? Region { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string InstagramHandle { get; set; } = string.Empty;

        public string? Website { get; set; }
        public decimal? Rating { get; set; }
        public int? UserRatingCount { get; set; }

        public bool IsVerified { get; set; }
        public string OpeningHours { get; set; } = string.Empty;

        // JSON-serialized List<Shared.WeeklyHoursEntry> - structured
        // day/open/close data used to compute "open now". Null when no
        // structured hours are known (e.g. shops imported from Google
        // Places, which only provided free-text OpeningHours above).
        public string? StructuredHoursJson { get; set; }

        // Publication state for artisan-created shops - Pending until an
        // admin approves it, at which point it becomes visible in
        // public/tourist-facing queries (GET /api/shops, map, etc). Shops
        // imported via the Google Places bulk import are backfilled to
        // Approved (see AddShopApprovalAndAnalytics migration) since
        // they're already live.
        public ShopStatus Status { get; set; } = ShopStatus.Approved;

        // Set by an admin's RejectShopCommand - shown to the artisan on
        // their dashboard so they know what to fix before resubmitting.
        // Cleared (set back to null) when the shop is resubmitted.
        public string? RejectionReason { get; set; }

        // Simple incrementing counter, bumped once per GET /api/shops/{id}
        // call (see Shop.Queries.GetByIdHandler) - not a full analytics
        // system, just enough for the Artisan Dashboard's stats row.
        public int ViewCount { get; set; }

        // Set on creation (Shop.Commands.AddHandler). Existing rows at the
        // time this field was added are backfilled to that migration's
        // apply time, since their real creation date isn't recoverable -
        // see AddShopCreatedAt migration.
        public DateTime CreatedAt { get; set; }

        public ICollection<ShopImage> Images { get; set; } = new List<ShopImage>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<ItineraryStop> ItineraryStops { get; set; } = new List<ItineraryStop>();
    }
}
