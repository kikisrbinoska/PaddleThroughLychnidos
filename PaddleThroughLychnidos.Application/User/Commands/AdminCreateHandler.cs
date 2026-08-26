using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class AdminCreateHandler : IRequestHandler<AdminCreateRequest, AdminCreateResponse>
    {
        private readonly IUserRepository _userRepository;

        public AdminCreateHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AdminCreateResponse> Handle(AdminCreateRequest request, CancellationToken cancellationToken)
        {
            if (await _userRepository.GetByUsernameAsync(request.Username) is not null)
            {
                throw new PaddleThroughLychnidosException("Username is already taken", HttpStatusCode.Conflict);
            }

            if (await _userRepository.GetByEmailAsync(request.Email) is not null)
            {
                throw new PaddleThroughLychnidosException("Email is already registered", HttpStatusCode.Conflict);
            }

            var user = new Domain.Entities.User
            {
                Name = request.Name,
                Username = request.Username,
                Email = request.Email,
                Password = PasswordHasher.HashPassword(request.Password),
                Role = request.Role,
                CreatedAt = DateTime.UtcNow,
            };

            await _userRepository.AddAsync(user);

            return new AdminCreateResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                Message = "User created successfully",
            };
        }
    }
}
