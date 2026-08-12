using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.Category.Queries
{
    public class GetByIdHandler : IRequestHandler<GetByIdRequest, GetByIdResponse>
    {
        private readonly ICategoryRepository _categoryRepository;

        public GetByIdHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<GetByIdResponse> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id);
            if (category == null)
            {
                throw new PaddleThroughLychnidosException($"Category with Id {request.Id} not found.", HttpStatusCode.NotFound);
            }

            return new GetByIdResponse
            {
                Id = category.Id,
                Name = category.Name,
                IconUrl = category.IconUrl,
            };
        }
    }
}
