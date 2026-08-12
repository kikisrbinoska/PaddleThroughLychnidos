using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Category.Queries
{
    public class GetHandler : IRequestHandler<GetRequest, List<GetResponse>>
    {
        private readonly ICategoryRepository _categoryRepository;

        public GetHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<GetResponse>> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetAllAsync();

            return categories
                .Select(category => new GetResponse
                {
                    Id = category.Id,
                    Name = category.Name,
                    IconUrl = category.IconUrl,
                })
                .ToList();
        }
    }
}
