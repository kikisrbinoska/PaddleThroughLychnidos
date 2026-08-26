using MediatR;
using PaddleThroughLychnidos.Domain.DTOs;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.User.Queries
{
    public class GetAllHandler : IRequestHandler<GetAllRequest, GetAllResponse>
    {
        private readonly IUserRepository _userRepository;

        public GetAllHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<GetAllResponse> Handle(GetAllRequest request, CancellationToken cancellationToken)
        {
            var pageNumber = request.PageNumber.GetValueOrDefault(1) < 1 ? 1 : request.PageNumber.GetValueOrDefault(1);
            var pageSize = request.PageSize.GetValueOrDefault(20) < 1 ? 20 : request.PageSize.GetValueOrDefault(20);

            var (count, list) = await _userRepository.GetPagedAsync(pageNumber, pageSize, request.Search, request.RoleFilter);

            var items = list
                .Select(user =>
                {
                    var shop = user.Shops.FirstOrDefault();
                    return new AdminUserListItem
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Username = user.Username,
                        Email = user.Email,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt,
                        ShopId = shop?.Id,
                        ShopName = shop?.Name,
                        ShopStatus = shop?.Status,
                    };
                })
                .ToList();

            var totalPages = (int)Math.Ceiling(count / (double)pageSize);

            return new GetAllResponse
            {
                Items = items,
                Metadata = new Metadata
                {
                    TotalCount = count,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                },
            };
        }
    }
}
