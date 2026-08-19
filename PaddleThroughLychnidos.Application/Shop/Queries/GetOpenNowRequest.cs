using MediatR;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    // Returns shops currently open, based on structured hours data.
    // Shops with no structured hours (IsOpenNow == null) are excluded -
    // "unknown" is not the same as "open".
    public class GetOpenNowRequest : IRequest<List<ShopListItem>>
    {
        /// <summary>Maximum number of shops to return. Defaults to 10.</summary>
        public int? Limit { get; set; }
    }
}
