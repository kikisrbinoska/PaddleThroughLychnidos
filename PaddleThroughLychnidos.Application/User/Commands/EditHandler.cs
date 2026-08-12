using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class EditHandler : IRequestHandler<EditRequest, EditResponse>
    {
        private readonly IUserRepository _userRepository;

        public EditHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<EditResponse> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            if (!string.Equals(user.Username, request.Username, StringComparison.Ordinal))
            {
                var existingByUsername = await _userRepository.GetByUsernameAsync(request.Username);
                if (existingByUsername is not null && existingByUsername.Id != user.Id)
                {
                    throw new PaddleThroughLychnidosException("Username is already taken", HttpStatusCode.Conflict);
                }
            }

            if (!string.Equals(user.Email, request.Email, StringComparison.Ordinal))
            {
                var existingByEmail = await _userRepository.GetByEmailAsync(request.Email);
                if (existingByEmail is not null && existingByEmail.Id != user.Id)
                {
                    throw new PaddleThroughLychnidosException("Email is already registered", HttpStatusCode.Conflict);
                }
            }

            user.Name = request.Name;
            user.Username = request.Username;
            user.Email = request.Email;

            await _userRepository.UpdateAsync(user);

            return new EditResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email,
                Message = "User updated successfully",
            };
        }
    }
}
