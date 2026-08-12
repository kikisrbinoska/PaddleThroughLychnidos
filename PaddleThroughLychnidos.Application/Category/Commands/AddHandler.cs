using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly ICategoryRepository _categoryRepository;

        public AddHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            var category = new Domain.Entities.Category
            {
                Name = request.Name,
                IconUrl = request.IconUrl,
            };

            await _categoryRepository.AddAsync(category);

            return new AddResponse
            {
                Id = category.Id,
                Name = category.Name,
                IconUrl = category.IconUrl,
                Message = "Category created successfully",
            };
        }
    }
}
