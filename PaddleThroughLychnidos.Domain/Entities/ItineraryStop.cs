using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class ItineraryStop : IEntity
    {
        public int Id { get; set; }

        public int ItineraryId { get; set; }
        public Itinerary Itinerary { get; set; } = null!;

        public int ShopId { get; set; }
        public Shop Shop { get; set; } = null!;

        public int Order { get; set; }
        public string Notes { get; set; } = string.Empty;
        public TimeSpan SuggestedTime { get; set; }
    }
}
