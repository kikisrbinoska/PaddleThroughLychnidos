using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly ICategoryRepository _categoryRepository;

        public DeleteHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("Category not found", HttpStatusCode.NotFound);

            await _categoryRepository.DeleteAsync(category);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "Category deleted successfully",
            };
        }
    }
}
