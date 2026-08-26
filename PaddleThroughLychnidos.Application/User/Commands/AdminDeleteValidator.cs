using FluentValidation;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class AdminDeleteValidator : AbstractValidator<AdminDeleteRequest>
    {
        public AdminDeleteValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.RequestingAdminId)
                .GreaterThan(0);
        }
    }
}
