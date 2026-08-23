using FluentValidation;

namespace PaddleThroughLychnidos.Application.Product.Commands
{
    public class DeleteValidator : AbstractValidator<DeleteRequest>
    {
        public DeleteValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.RequestingUserId)
                .GreaterThan(0);
        }
    }
}
