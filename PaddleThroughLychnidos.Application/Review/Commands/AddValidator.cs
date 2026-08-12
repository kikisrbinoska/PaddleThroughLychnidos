using FluentValidation;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class AddValidator : AbstractValidator<AddRequest>
    {
        public AddValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5);

            RuleFor(x => x.Comment)
                .NotEmpty()
                .MaximumLength(2000);
        }
    }
}
