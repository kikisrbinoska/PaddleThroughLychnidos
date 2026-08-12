using FluentValidation;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class EditValidator : AbstractValidator<EditRequest>
    {
        public EditValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.VideoUrl)
                .NotEmpty()
                .MaximumLength(2048);
        }
    }
}
