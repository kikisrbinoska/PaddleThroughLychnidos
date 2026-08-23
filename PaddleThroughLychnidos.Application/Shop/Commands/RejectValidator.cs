using FluentValidation;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class RejectValidator : AbstractValidator<RejectRequest>
    {
        public RejectValidator()
        {
            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.AdminId)
                .GreaterThan(0);

            RuleFor(x => x.Reason)
                .NotEmpty()
                .MaximumLength(1000);
        }
    }
}
