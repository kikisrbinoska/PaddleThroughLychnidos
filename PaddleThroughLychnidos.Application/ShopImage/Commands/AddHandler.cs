using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ShopImage.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly IShopImageRepository _shopImageRepository;
        private readonly IShopRepository _shopRepository;

        public AddHandler(IShopImageRepository shopImageRepository, IShopRepository shopRepository)
        {
            _shopImageRepository = shopImageRepository;
            _shopRepository = shopRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            _ = await _shopRepository.GetByIdAsync(request.ShopId)
                ?? throw new PaddleThroughLychnidosException("Shop not found", HttpStatusCode.NotFound);

            var shopImage = new Domain.Entities.ShopImage
            {
                ShopId = request.ShopId,
                Url = request.Url,
            };

            await _shopImageRepository.AddAsync(shopImage);

            return new AddResponse
            {
                Id = shopImage.Id,
                ShopId = shopImage.ShopId,
                Url = shopImage.Url,
                Message = "Shop image created successfully",
            };
        }
    }
}
