using FluentValidation;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class RegisterValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.Username)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(150);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8);

            RuleFor(x => x.Role)
                .Must(role => role is "RegularUser" or "Artisan")
                .WithMessage("Role must be either RegularUser or Artisan");
        }
    }
}
