using FluentValidation;

namespace PaddleThroughLychnidos.Application.DayPlan.Commands
{
    public class CreateValidator : AbstractValidator<CreateRequest>
    {
        public CreateValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.ShopIds)
                .NotEmpty()
                .WithMessage("Select at least one saved place to build a day plan.");

            RuleFor(x => x.ShopIds)
                .Must(ids => ids.Distinct().Count() == ids.Count)
                .WithMessage("The same place can't be added to a day plan twice.")
                .When(x => x.ShopIds.Count > 0);
        }
    }
}
