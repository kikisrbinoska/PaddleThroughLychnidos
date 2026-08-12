using FluentValidation;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class AddValidator : AbstractValidator<AddRequest>
    {
        public AddValidator()
        {
            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(2000);

            RuleFor(x => x.Price)
                .GreaterThan(0);

            RuleFor(x => x.ImageUrl)
                .NotEmpty()
                .MaximumLength(2048);
        }
    }
}
