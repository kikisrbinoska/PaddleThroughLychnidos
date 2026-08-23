using FluentValidation;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class SubmitValidator : AbstractValidator<SubmitRequest>
    {
        public SubmitValidator()
        {
            RuleFor(x => x.ShopId)
                .GreaterThan(0);

            RuleFor(x => x.OwnerId)
                .GreaterThan(0);

            RuleFor(x => x.Notes)
                .NotEmpty()
                .MaximumLength(2000);

            RuleFor(x => x.DocumentUrls)
                .NotEmpty()
                .WithMessage("Upload at least one supporting photo or document.");
        }
    }
}
