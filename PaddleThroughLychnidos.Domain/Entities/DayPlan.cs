using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    // A user-built day plan assembled from their own saved shops (see
    // TravelPlanItem) - distinct from the curated, admin-authored Itinerary
    // entity. One user can have several day plans (e.g. for different dates).
    public class DayPlan : IEntity
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Title { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<DayPlanStop> Stops { get; set; } = new List<DayPlanStop>();
    }
}
