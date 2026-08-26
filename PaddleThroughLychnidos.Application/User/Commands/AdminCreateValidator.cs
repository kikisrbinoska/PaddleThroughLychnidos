using FluentValidation;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class AdminCreateValidator : AbstractValidator<AdminCreateRequest>
    {
        public AdminCreateValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Username)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(256);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8);

            RuleFor(x => x.Role)
                .IsInEnum();
        }
    }
}
