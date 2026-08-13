using FluentValidation;

namespace PaddleThroughLychnidos.Application.Itinerary.Commands
{
    public class CreateValidator : AbstractValidator<CreateRequest>
    {
        public CreateValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(2000);

            RuleFor(x => x.CoverImageUrl)
                .MaximumLength(500);

            RuleFor(x => x.DurationHours)
                .GreaterThan(0);

            RuleFor(x => x.RegionId)
                .GreaterThan(0);

            RuleFor(x => x.Difficulty)
                .IsInEnum();

            RuleFor(x => x.Stops)
                .NotEmpty()
                .WithMessage("An itinerary must have at least one stop.");

            RuleForEach(x => x.Stops).ChildRules(stop =>
            {
                stop.RuleFor(s => s.ShopId)
                    .GreaterThan(0);

                stop.RuleFor(s => s.Notes)
                    .MaximumLength(1000);
            });

            RuleFor(x => x.Stops)
                .Must(stops => stops.Select(s => s.ShopId).Distinct().Count() == stops.Count)
                .WithMessage("Each shop can only appear once in an itinerary.")
                .When(x => x.Stops.Count > 0);
        }
    }
}
