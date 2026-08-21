using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.User.Commands;
using PaddleThroughLychnidos.Application.User.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IMediator mediator, ILogger<UsersController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/users/me
        [HttpGet("me")]
        public async Task<ActionResult<GetByIdResponse>> GetMe()
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Fetching profile for user {userId}", userId);
            var user = await _mediator.Send(new GetByIdRequest { Id = userId });
            return Ok(user);
        }

        // PUT api/users/me
        [HttpPut("me")]
        public async Task<ActionResult<EditResponse>> PutMe([FromBody] EditRequest request)
        {
            var userId = GetCurrentUserId();
            request.Id = userId;
            _logger.LogInformation("Updating profile for user {userId}", userId);
            var user = await _mediator.Send(request);
            return Ok(user);
        }

        // PUT api/users/me/password
        [HttpPut("me/password")]
        public async Task<ActionResult<ChangePasswordResponse>> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = GetCurrentUserId();
            request.UserId = userId;
            _logger.LogInformation("Changing password for user {userId}", userId);
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        private int GetCurrentUserId()
        {
            var value = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (value == null || !int.TryParse(value, out var userId))
            {
                throw new PaddleThroughLychnidosException("Invalid or missing user identity", HttpStatusCode.Unauthorized);
            }

            return userId;
        }
    }
}
