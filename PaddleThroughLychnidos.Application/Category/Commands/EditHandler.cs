using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly ICategoryRepository _categoryRepository;

        public EditHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Category not found", HttpStatusCode.NotFound);

            category.Name = request.Name;
            category.IconUrl = request.IconUrl;

            await _categoryRepository.UpdateAsync(category);

            return new EditResponse
            {
                Id = category.Id,
                Name = category.Name,
                IconUrl = category.IconUrl,
                Message = "Category updated successfully",
            };
        }
    }
}
