using FluentValidation;

namespace PaddleThroughLychnidos.Application.Region.Comands
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
