using MediatR;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class DeleteHandler : IRequestHandler<DeleteRequest, DeleteResponse>
    {
        private readonly IUserRepository _userRepository;

        public DeleteHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<DeleteResponse> Handle(DeleteRequest request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id)
                ?? throw new PaddleThroughLychnidosException("User not found", HttpStatusCode.NotFound);

            await _userRepository.DeleteAsync(user);

            return new DeleteResponse
            {
                Id = request.Id,
                Message = "User deleted successfully",
            };
        }
    }
}
