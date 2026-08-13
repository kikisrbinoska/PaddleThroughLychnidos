using FluentValidation;

namespace PaddleThroughLychnidos.Application.TravelPlan.Commands
{
    public class RemoveValidator : AbstractValidator<RemoveRequest>
    {
        public RemoveValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.UserId)
                .GreaterThan(0);
        }
    }
}
