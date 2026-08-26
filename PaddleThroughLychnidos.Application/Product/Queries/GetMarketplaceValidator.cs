using FluentValidation;

namespace PaddleThroughLychnidos.Application.Product.Queries
{
    public class GetMarketplaceValidator : AbstractValidator<GetMarketplaceRequest>
    {
        public GetMarketplaceValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0)
                .When(x => x.PageNumber.HasValue);

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .When(x => x.PageSize.HasValue);

            RuleFor(x => x.CategoryId)
                .GreaterThan(0)
                .When(x => x.CategoryId.HasValue);

            RuleFor(x => x.RegionId)
                .GreaterThan(0)
                .When(x => x.RegionId.HasValue);

            RuleFor(x => x.MinPrice)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MinPrice.HasValue);

            RuleFor(x => x.MaxPrice)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MaxPrice.HasValue);
        }
    }
}
