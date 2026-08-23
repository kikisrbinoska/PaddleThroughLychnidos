using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Category.Queries
{
    public class GetForAdminHandler : IRequestHandler<GetForAdminRequest, List<GetForAdminResponse>>
    {
        private readonly ICategoryRepository _categoryRepository;

        public GetForAdminHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<GetForAdminResponse>> Handle(GetForAdminRequest request, CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetAllAsync();

            var items = new List<GetForAdminResponse>();
            foreach (var category in categories)
            {
                items.Add(new GetForAdminResponse
                {
                    Id = category.Id,
                    Name = category.Name,
                    IconUrl = category.IconUrl,
                    ShopCount = await _categoryRepository.GetShopCountAsync(category.Id),
                });
            }

            return items;
        }
    }
}
