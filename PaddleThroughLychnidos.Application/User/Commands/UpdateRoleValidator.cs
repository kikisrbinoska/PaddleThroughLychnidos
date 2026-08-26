using FluentValidation;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class UpdateRoleValidator : AbstractValidator<UpdateRoleRequest>
    {
        public UpdateRoleValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.NewRole)
                .IsInEnum();

            RuleFor(x => x.RequestingAdminId)
                .GreaterThan(0);
        }
    }
}
