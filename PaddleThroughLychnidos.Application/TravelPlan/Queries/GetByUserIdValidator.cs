using FluentValidation;

namespace PaddleThroughLychnidos.Application.TravelPlan.Queries
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
