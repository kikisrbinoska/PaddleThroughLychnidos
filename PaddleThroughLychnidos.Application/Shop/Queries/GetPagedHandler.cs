using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Shop.Queries
{
    public class GetPagedHandler : IRequestHandler<GetPagedRequest, GetPagedResponse>
    {
        private readonly IShopRepository _shopRepository;

        public GetPagedHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<GetPagedResponse> Handle(GetPagedRequest request, CancellationToken cancellationToken)
        {
            var (count, list) = await _shopRepository.GetPagedAsync(request.PageNumber, request.PageSize, request.SearchWord, request.Tag);

            var items = list
                .Select(shop => new ShopListItem
                {
                    Id = shop.Id,
                    OwnerId = shop.OwnerId,
                    Name = shop.Name,
                    Description = shop.Description,
                    Address = shop.Address,
                    RegionId = shop.RegionId,
                    CategoryId = shop.CategoryId,
                    IsVerified = shop.IsVerified,
                })
                .ToList();

            var pageSize = request.PageSize;
            var totalPages = pageSize.HasValue && pageSize.Value > 0
                ? (int)Math.Ceiling(count / (double)pageSize.Value)
                : 1;

            return new GetPagedResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
