using MediatR;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class DeleteRequest : IRequest<DeleteResponse>
    {
        public int Id { get; set; }
    }
}
