using MediatR;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class EditRequest : IRequest<EditResponse>
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
