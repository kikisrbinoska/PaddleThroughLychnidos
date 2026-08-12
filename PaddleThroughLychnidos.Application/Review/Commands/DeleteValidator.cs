using FluentValidation;

namespace PaddleThroughLychnidos.Application.Review.Commands
{
    public class DeleteValidator : AbstractValidator<DeleteRequest>
    {
        public DeleteValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);
        }
    }
}
