using FluentValidation;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class ApproveValidator : AbstractValidator<ApproveRequest>
    {
        public ApproveValidator()
        {
            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.AdminId)
                .GreaterThan(0);
        }
    }
}
