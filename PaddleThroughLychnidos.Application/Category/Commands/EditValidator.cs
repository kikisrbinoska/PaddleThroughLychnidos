using FluentValidation;

namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class EditValidator : AbstractValidator<EditRequest>
    {
        public EditValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.IconUrl)
                .NotEmpty()
                .MaximumLength(2048);
        }
    }
}
