using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.DayPlan.Commands;
using PaddleThroughLychnidos.Application.DayPlan.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DayPlansController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<DayPlansController> _logger;

        public DayPlansController(IMediator mediator, ILogger<DayPlansController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<DayPlansController>
        [HttpGet]
        public async Task<ActionResult<GetByUserIdResponse>> Get()
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Fetching day plans for user {userId}", userId);
            var plans = await _mediator.Send(new GetByUserIdRequest { UserId = userId });
            return Ok(plans);
        }

        // POST api/<DayPlansController>
        [HttpPost]
        public async Task<ActionResult<CreateResponse>> Post([FromBody] CreateRequest request)
        {
            var userId = GetCurrentUserId();
            request.UserId = userId;
            _logger.LogInformation("Creating a day plan for user {userId}", userId);
            var plan = await _mediator.Send(request);
            return Ok(plan);
        }

        // DELETE api/<DayPlansController>/5
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Deleting day plan {id} for user {userId}", id, userId);
            var response = await _mediator.Send(new DeleteRequest { Id = id, UserId = userId });
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
