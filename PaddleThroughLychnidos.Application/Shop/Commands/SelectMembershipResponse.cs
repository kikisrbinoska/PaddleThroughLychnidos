using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class SelectMembershipResponse
    {
        public int ShopId { get; set; }
        public MembershipTier MembershipTier { get; set; }
        public DateTime? MembershipActivatedAt { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
