using FluentValidation;

namespace PaddleThroughLychnidos.Application.LearnVideo.Queries
{
    public class GetPagedValidator : AbstractValidator<GetPagedRequest>
    {
        public GetPagedValidator()
        {
            RuleFor(x => x.Category)
                .IsInEnum();

            RuleFor(x => x.PageNumber)
                .GreaterThan(0)
                .When(x => x.PageNumber.HasValue);

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .When(x => x.PageSize.HasValue);
        }
    }
}
