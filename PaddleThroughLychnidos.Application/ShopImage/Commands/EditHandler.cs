using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IShopImageRepository _shopImageRepository;

        public EditHandler(IShopImageRepository shopImageRepository)
        {
            _shopImageRepository = shopImageRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var shopImage = await _shopImageRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Shop image not found", HttpStatusCode.NotFound);

            shopImage.Url = request.Url;

            await _shopImageRepository.UpdateAsync(shopImage);

            return new EditResponse
            {
                Id = shopImage.Id,
                ShopId = shopImage.ShopId,
                Url = shopImage.Url,
                Message = "Shop image updated successfully",
            };
        }
    }
}
