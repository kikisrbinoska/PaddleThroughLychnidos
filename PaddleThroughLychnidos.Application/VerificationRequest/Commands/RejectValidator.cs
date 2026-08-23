using FluentValidation;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class RejectValidator : AbstractValidator<RejectRequest>
    {
        public RejectValidator()
        {
            RuleFor(x => x.RequestId)
                .GreaterThan(0);

            RuleFor(x => x.AdminId)
                .GreaterThan(0);

            RuleFor(x => x.Reason)
                .NotEmpty()
                .MaximumLength(1000);
        }
    }
}
