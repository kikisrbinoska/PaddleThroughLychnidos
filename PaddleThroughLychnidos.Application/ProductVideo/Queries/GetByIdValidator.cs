using FluentValidation;

namespace PaddleThroughLychnidos.Application.ProductVideo.Queries
{
    public class GetByIdValidator : AbstractValidator<GetByIdRequest>
    {
        public GetByIdValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);
        }
    }
}
