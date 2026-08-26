using MediatR;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class UpdateRoleHandler : IRequestHandler<UpdateRoleRequest, UpdateRoleResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IShopRepository _shopRepository;

        public UpdateRoleHandler(IUserRepository userRepository, IShopRepository shopRepository)
        {
            _userRepository = userRepository;
            _shopRepository = shopRepository;
        }

        public async Task<UpdateRoleResponse> Handle(UpdateRoleRequest request, CancellationToken cancellationToken)
        {
            if (request.UserId == request.RequestingAdminId)
            {
                throw new PaddleThroughLychnidosException("You cannot change your own role", HttpStatusCode.Forbidden);
            }

            var user = await _userRepository.GetByIdAsync(request.UserId)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            // Demoting an Artisan who currently owns an Approved (live,
            // publicly visible) shop would orphan that shop's storefront.
            // Block the demotion with a clear message rather than silently
            // leaving an ownerless-in-spirit shop behind - the admin should
            // reassign or remove the shop(s) first. An Artisan may own more
            // than one shop.
            if (user.Role == UserRole.Artisan && request.NewRole != UserRole.Artisan)
            {
                var shops = await _shopRepository.GetByOwnerIdAsync(user.Id);
                if (shops.Any(s => s.Status == ShopStatus.Approved))
                {
                    throw new PaddleThroughLychnidosException(
                        "This user owns an active shop - reassign or remove the shop(s) first",
                        HttpStatusCode.Conflict);
                }
            }

            user.Role = request.NewRole;
            await _userRepository.UpdateAsync(user);

            return new UpdateRoleResponse
            {
                Id = user.Id,
                Role = user.Role,
                Message = "User role updated successfully",
            };
        }
    }
}
