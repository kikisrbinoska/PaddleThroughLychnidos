using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class TravelPlanItem : IEntity
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? ShopId { get; set; }
        public Shop? Shop { get; set; }

        public int? ItineraryId { get; set; }
        public Itinerary? Itinerary { get; set; }

        public DateTime AddedAt { get; set; }
    }
}
