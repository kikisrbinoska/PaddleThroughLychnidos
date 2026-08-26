using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class AdminDeleteHandler : IRequestHandler<AdminDeleteRequest, AdminDeleteResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IShopRepository _shopRepository;

        public AdminDeleteHandler(IUserRepository userRepository, IShopRepository shopRepository)
        {
            _userRepository = userRepository;
            _shopRepository = shopRepository;
        }

        public async Task<AdminDeleteResponse> Handle(AdminDeleteRequest request, CancellationToken cancellationToken)
        {
            if (request.UserId == request.RequestingAdminId)
            {
                throw new PaddleThroughLychnidosException("You cannot delete your own account", HttpStatusCode.Forbidden);
            }

            var user = await _userRepository.GetByIdAsync(request.UserId)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            // Shop.OwnerId -> User is a Restrict FK, so a hard delete would
            // otherwise fail at the database with an opaque error - surface
            // a clear message instead and require the shop(s) to be
            // reassigned or removed first. An Artisan may own more than one.
            var shops = await _shopRepository.GetByOwnerIdAsync(user.Id);
            if (shops.Count > 0)
            {
                throw new PaddleThroughLychnidosException(
                    shops.Count == 1
                        ? "This user owns a shop - reassign or remove the shop first"
                        : $"This user owns {shops.Count} shops - reassign or remove them first",
                    HttpStatusCode.Conflict);
            }

            await _userRepository.DeleteAsync(user);

            return new AdminDeleteResponse
            {
                Id = request.UserId,
                Message = "User deleted successfully",
            };
        }
    }
}
