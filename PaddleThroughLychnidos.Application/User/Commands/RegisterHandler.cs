using MediatR;
using PaddleThroughLychnidos.Application.Abstractions;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class RegisterHandler : IRequestHandler<RegisterRequest, RegisterResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;

        public RegisterHandler(IUserRepository userRepository, IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        public async Task<RegisterResponse> Handle(RegisterRequest request, CancellationToken cancellationToken)
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
                Role = Enum.Parse<Domain.Entities.UserRole>(request.Role),
                CreatedAt = DateTime.UtcNow,
            };

            await _userRepository.AddAsync(user);

            var token = _authService.GenerateToken(user.Id, user.Username, user.Role.ToString());

            return new RegisterResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                Token = token,
            };
        }
    }
}
