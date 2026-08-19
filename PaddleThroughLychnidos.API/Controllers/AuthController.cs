using MediatR;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.User.Commands;

namespace PaddleThroughLychnidos.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ISender _sender;

        public AuthController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
        {
            var response = await _sender.Send(request, cancellationToken);
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register(RegisterRequest request, CancellationToken cancellationToken)
        {
            var response = await _sender.Send(request, cancellationToken);
            return Ok(response);
        }
    }
}
