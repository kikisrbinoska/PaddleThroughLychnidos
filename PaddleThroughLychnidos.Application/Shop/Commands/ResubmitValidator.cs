using FluentValidation;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class ResubmitValidator : AbstractValidator<ResubmitRequest>
    {
        public ResubmitValidator()
        {
            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.OwnerId)
                .GreaterThan(0);
        }
    }
}
