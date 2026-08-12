using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Shop.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IShopRepository _shopRepository;

        public DeleteHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var shop = await _shopRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            await _shopRepository.DeleteAsync(shop);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Shop deleted successfully",
            };
        }
    }
}
