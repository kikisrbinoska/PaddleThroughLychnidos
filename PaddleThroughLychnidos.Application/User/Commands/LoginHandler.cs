using MediatR;
using PaddleThroughLychnidos.Application.Abstractions;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class LoginHandler : IRequestHandler<LoginRequest, LoginResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;

        public LoginHandler(IUserRepository userRepository, IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        public async Task<LoginResponse> Handle(LoginRequest request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username)
                ?? throw new PaddleThroughLychnidosException("Invalid username or password", HttpStatusCode.Unauthorized);

            if (!PasswordHasher.VerifyPassword(request.Password, user.Password))
            {
                throw new PaddleThroughLychnidosException("Invalid username or password", HttpStatusCode.Unauthorized);
            }

            var token = _authService.GenerateToken(user.Id, user.Username, user.Role.ToString());

            return new LoginResponse
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
