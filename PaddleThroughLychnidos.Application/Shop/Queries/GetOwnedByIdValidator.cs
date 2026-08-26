using FluentValidation;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetOwnedByIdValidator : AbstractValidator<GetOwnedByIdRequest>
    {
        public GetOwnedByIdValidator()
        {
            RuleFor(x => x.ShopId).GreaterThan(0);
            RuleFor(x => x.OwnerId).GreaterThan(0);
        }
    }
}
