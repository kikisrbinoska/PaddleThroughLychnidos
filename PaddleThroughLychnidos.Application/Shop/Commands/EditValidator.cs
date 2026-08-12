using FluentValidation;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class EditValidator : AbstractValidator<EditRequest>
    {
        public EditValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(2000);

            RuleFor(x => x.Story)
                .MaximumLength(4000);

            RuleFor(x => x.Latitude)
                .InclusiveBetween(-90, 90);

            RuleFor(x => x.Longitude)
                .InclusiveBetween(-180, 180);

            RuleFor(x => x.Address)
                .NotEmpty()
                .MaximumLength(300);

            RuleFor(x => x.RegionId)
                .GreaterThan(0);

            RuleFor(x => x.CategoryId)
                .GreaterThan(0);

            RuleFor(x => x.PhoneNumber)
                .MaximumLength(30);

            RuleFor(x => x.WhatsappNumber)
                .MaximumLength(30);

            RuleFor(x => x.Email)
                .EmailAddress()
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.InstagramHandle)
                .MaximumLength(100);

            RuleFor(x => x.OpeningHours)
                .MaximumLength(500);
        }
    }
}
