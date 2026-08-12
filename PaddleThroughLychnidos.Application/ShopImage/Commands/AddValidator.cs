using FluentValidation;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class AddValidator : AbstractValidator<AddRequest>
    {
        public AddValidator()
        {
            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.Url)
                .NotEmpty()
                .MaximumLength(2048);
        }
    }
}
