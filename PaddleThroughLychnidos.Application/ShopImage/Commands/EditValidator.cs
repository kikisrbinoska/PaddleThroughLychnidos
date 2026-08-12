using FluentValidation;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class EditValidator : AbstractValidator<EditRequest>
    {
        public EditValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.Url)
                .NotEmpty()
                .MaximumLength(2048);
        }
    }
}
