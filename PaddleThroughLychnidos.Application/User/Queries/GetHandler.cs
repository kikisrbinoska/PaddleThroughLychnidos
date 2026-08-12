using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;

namespace PaddleThroughLychnidos.Application.User.Queries
{
    public class GetHandler : IRequestHandler<GetRequest, List<GetResponse>>
    {
        private readonly IUserRepository _userRepository;

        public GetHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<GetResponse>> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var users = await _userRepository.GetAllAsync();

            return users
                .Select(user => new GetResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt,
                })
                .ToList();
        }
    }
}
