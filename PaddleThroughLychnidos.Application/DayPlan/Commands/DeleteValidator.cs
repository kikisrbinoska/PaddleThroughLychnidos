using FluentValidation;

namespace PaddleThroughLychnidos.Application.DayPlan.Commands
{
    public class DeleteValidator : AbstractValidator<DeleteRequest>
    {
        public DeleteValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.UserId)
                .GreaterThan(0);
        }
    }
}
