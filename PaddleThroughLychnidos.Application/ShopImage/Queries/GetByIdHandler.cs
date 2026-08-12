using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.ShopImage.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly IShopImageRepository _shopImageRepository;

        public GetByIdHandler(IShopImageRepository shopImageRepository)
        {
            _shopImageRepository = shopImageRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var shopImage = await _shopImageRepository.GetByIdAsync(request.Id);
            if (shopImage == null)
            {
                throw new PaddleThroughLychnidosException($"Shop image with Id {request.Id} not found.", HttpStatusCode.NotFound);
            }

            return new GetByIdResponse
            {
                Id = shopImage.Id,
                ShopId = shopImage.ShopId,
                Url = shopImage.Url,
            };
        }
    }
}
