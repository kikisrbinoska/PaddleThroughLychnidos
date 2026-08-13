using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.TravelPlan.Commands;
using PaddleThroughLychnidos.Application.TravelPlan.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TravelPlanController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<TravelPlanController> _logger;

        public TravelPlanController(IMediator mediator, ILogger<TravelPlanController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<TravelPlanController>
        [HttpGet]
        public async Task<ActionResult<GetByUserIdResponse>> Get()
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Fetching travel plan for user {userId}", userId);
            var plan = await _mediator.Send(new GetByUserIdRequest { UserId = userId });
            return Ok(plan);
        }

        // POST api/<TravelPlanController>
        [HttpPost]
        public async Task<ActionResult<AddResponse>> Post([FromBody] AddRequest request)
        {
            var userId = GetCurrentUserId();
            request.UserId = userId;
            _logger.LogInformation("Adding item to travel plan for user {userId}", userId);
            var item = await _mediator.Send(request);
            return Ok(item);
        }

        // DELETE api/<TravelPlanController>/5
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<RemoveResponse>> Delete(int id)
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Removing travel plan item {id} for user {userId}", id, userId);
            var response = await _mediator.Send(new RemoveRequest { Id = id, UserId = userId });
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
