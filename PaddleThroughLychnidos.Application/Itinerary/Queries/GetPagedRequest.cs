using MediatR;

namespace PaddleThroughLychnidos.Application.Itinerary.Queries
{
    public class GetPagedRequest : IRequest<GetPagedResponse>
    {
        /// <summary>Page number to return (1-based). Defaults to 1.</summary>
        public int? PageNumber { get; set; }

        /// <summary>Number of items per page. Defaults to 20.</summary>
        public int? PageSize { get; set; }

        /// <summary>Filters itineraries belonging to the given Region id.</summary>
        public int? RegionId { get; set; }

        /// <summary>Filters itineraries with DurationHours &gt;= this value.</summary>
        public int? MinDurationHours { get; set; }

        /// <summary>Filters itineraries with DurationHours &lt;= this value.</summary>
        public int? MaxDurationHours { get; set; }
    }
}
