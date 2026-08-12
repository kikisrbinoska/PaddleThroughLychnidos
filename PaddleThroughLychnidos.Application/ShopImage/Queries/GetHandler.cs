using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.ShopImage.Queries
{
    public class GetHandler : IRequestHandler<GetRequest, List<GetResponse>>
    {
        private readonly IShopImageRepository _shopImageRepository;

        public GetHandler(IShopImageRepository shopImageRepository)
        {
            _shopImageRepository = shopImageRepository;
        }

        public async Task<List<GetResponse>> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var shopImages = await _shopImageRepository.GetAllAsync();

            var query = shopImages.AsEnumerable();

            if (request.ShopId.HasValue)
            {
                query = query.Where(si => si.ShopId == request.ShopId.Value);
            }

            return query
                .Select(shopImage => new GetResponse
                {
                    Id = shopImage.Id,
                    ShopId = shopImage.ShopId,
                    Url = shopImage.Url,
                })
                .ToList();
        }
    }
}
