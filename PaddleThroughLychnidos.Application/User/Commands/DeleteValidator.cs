using FluentValidation;

namespace PaddleThroughLychnidos.Application.User.Commands
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
