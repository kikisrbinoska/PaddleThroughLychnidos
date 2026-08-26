using FluentValidation;

namespace PaddleThroughLychnidos.Application.User.Queries
{
    public class GetAllValidator : AbstractValidator<GetAllRequest>
    {
        public GetAllValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0)
                .When(x => x.PageNumber.HasValue);

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .When(x => x.PageSize.HasValue);
        }
    }
}
