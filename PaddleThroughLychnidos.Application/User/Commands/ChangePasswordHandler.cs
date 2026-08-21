using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class ChangePasswordHandler : IRequestHandler<ChangePasswordRequest, ChangePasswordResponse>
    {
        private readonly IUserRepository _userRepository;

        public ChangePasswordHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ChangePasswordResponse> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            if (!PasswordHasher.VerifyPassword(request.CurrentPassword, user.Password))
            {
                throw new PaddleThroughLychnidosException("Current password is incorrect", HttpStatusCode.BadRequest);
            }

            user.Password = PasswordHasher.HashPassword(request.NewPassword);

            await _userRepository.UpdateAsync(user);

            return new ChangePasswordResponse
            {
                Message = "Password changed successfully",
            };
        }
    }
}
