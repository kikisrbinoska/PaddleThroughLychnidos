using FluentValidation;

namespace PaddleThroughLychnidos.Application.ProductVideo.Commands
{
    public class AddValidator : AbstractValidator<AddRequest>
    {
        public AddValidator()
        {
            RuleFor(x => x.ProductId)
                .GreaterThan(0);

            RuleFor(x => x.VideoUrl)
                .NotEmpty()
                .MaximumLength(2048);
        }
    }
}
