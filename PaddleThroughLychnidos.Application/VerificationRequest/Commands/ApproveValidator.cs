using FluentValidation;

namespace PaddleThroughLychnidos.Application.VerificationRequest.Commands
{
    public class ApproveValidator : AbstractValidator<ApproveRequest>
    {
        public ApproveValidator()
        {
            RuleFor(x => x.RequestId)
                .GreaterThan(0);

            RuleFor(x => x.AdminId)
                .GreaterThan(0);
        }
    }
}
