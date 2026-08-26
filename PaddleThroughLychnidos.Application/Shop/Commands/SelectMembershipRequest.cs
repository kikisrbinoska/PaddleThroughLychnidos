using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    /// <summary>
    /// Simulated membership selection - no payment gateway call, no
    /// transaction record. This literally just updates MembershipTier (and
    /// MembershipActivatedAt) on the shop, immediately, on click.
    /// </summary>
    public class SelectMembershipRequest : IRequest<SelectMembershipResponse>
    {
        public int ShopId { get; set; }

        // Never trust a client-supplied value here - the controller
        // overwrites this from the authenticated artisan's JWT claims
        // before dispatching. Used to verify the requester owns ShopId.
        public int OwnerId { get; set; }

        public MembershipTier Tier { get; set; }
    }
}
