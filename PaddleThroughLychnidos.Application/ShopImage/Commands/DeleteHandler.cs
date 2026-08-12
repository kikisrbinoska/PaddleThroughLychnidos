using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IShopImageRepository _shopImageRepository;

        public DeleteHandler(IShopImageRepository shopImageRepository)
        {
            _shopImageRepository = shopImageRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var shopImage = await _shopImageRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Shop image not found", HttpStatusCode.NotFound);

            await _shopImageRepository.DeleteAsync(shopImage);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Shop image deleted successfully",
            };
        }
    }
}
