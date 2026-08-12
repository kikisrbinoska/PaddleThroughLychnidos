using FluentValidation;

namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class AddValidator : AbstractValidator<AddRequest>
    {
        public AddValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(1000);

            RuleFor(x => x.PolygonGeoJson)
                .NotEmpty();
        }
    }
}
