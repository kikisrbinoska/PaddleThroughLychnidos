using FluentValidation;

namespace PaddleThroughLychnidos.Application.TravelPlan.Commands
{
    public class AddValidator : AbstractValidator<AddRequest>
    {
        public AddValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x)
                .Must(x => x.ShopId.HasValue ^ x.ItineraryId.HasValue)
                .WithMessage("Exactly one of ShopId or ItineraryId must be provided.");

            RuleFor(x => x.ShopId)
                .GreaterThan(0)
                .When(x => x.ShopId.HasValue);

            RuleFor(x => x.ItineraryId)
                .GreaterThan(0)
                .When(x => x.ItineraryId.HasValue);
        }
    }
}
