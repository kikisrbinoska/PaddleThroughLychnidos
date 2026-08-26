using FluentValidation;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class SelectMembershipValidator : AbstractValidator<SelectMembershipRequest>
    {
        public SelectMembershipValidator()
        {
            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.OwnerId)
                .GreaterThan(0);

            RuleFor(x => x.Tier)
                .IsInEnum();
        }
    }
}
