using FluentValidation;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class EditValidator : AbstractValidator<EditRequest>
    {
        public EditValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5);

            RuleFor(x => x.Comment)
                .NotEmpty()
                .MaximumLength(2000);
        }
    }
}
