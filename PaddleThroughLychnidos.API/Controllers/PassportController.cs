using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.Passport.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PassportController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<PassportController> _logger;

        public PassportController(IMediator mediator, ILogger<PassportController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<PassportController>
        [HttpGet]
        public async Task<ActionResult<GetByUserIdResponse>> Get()
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Fetching passport stamps for user {userId}", userId);
            var passport = await _mediator.Send(new GetByUserIdRequest { UserId = userId });
            return Ok(passport);
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
