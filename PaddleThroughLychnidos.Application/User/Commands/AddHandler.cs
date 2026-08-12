using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class AddHandler : IRequestHandler<AddRequest, AddResponse>
    {
        private readonly IUserRepository _userRepository;

        public AddHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AddResponse> Handle(AddRequest request, CancellationToken cancellationToken)
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
                Role = Domain.Entities.UserRole.RegularUser,
                CreatedAt = DateTime.UtcNow,
            };

            await _userRepository.AddAsync(user);

            return new AddResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email,
                Message = "User registered successfully",
            };
        }
    }
}
