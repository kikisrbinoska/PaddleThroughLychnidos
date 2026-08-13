using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class Itinerary : IEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public int DurationHours { get; set; }

        public int RegionId { get; set; }
        public Region Region { get; set; } = null!;

        public ItineraryDifficulty Difficulty { get; set; }

        public ICollection<ItineraryStop> Stops { get; set; } = new List<ItineraryStop>();
    }
}