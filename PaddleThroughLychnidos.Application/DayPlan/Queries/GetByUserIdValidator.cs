using FluentValidation;

namespace PaddleThroughLychnidos.Application.DayPlan.Queries
{
    public class GetByUserIdValidator : AbstractValidator<GetByUserIdRequest>
    {
        public GetByUserIdValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);
        }
    }
}
