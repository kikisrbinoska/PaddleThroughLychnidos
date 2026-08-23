using FluentValidation;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetByOwnerIdValidator : AbstractValidator<GetByOwnerIdRequest>
    {
        public GetByOwnerIdValidator()
        {
            RuleFor(x => x.OwnerId)
                .GreaterThan(0);
        }
    }
}
