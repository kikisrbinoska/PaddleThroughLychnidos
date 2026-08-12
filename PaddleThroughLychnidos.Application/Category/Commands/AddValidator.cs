using FluentValidation;

namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class AddValidator : AbstractValidator<AddRequest>
    {
        public AddValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.IconUrl)
                .NotEmpty()
                .MaximumLength(2048);
        }
    }
}
