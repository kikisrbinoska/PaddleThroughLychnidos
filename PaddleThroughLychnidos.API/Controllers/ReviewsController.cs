using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.Review.Commands;
using PaddleThroughLychnidos.Application.Review.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(IMediator mediator, ILogger<ReviewsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<ReviewsController>?shopId=5&userId=2&pageNumber=1&pageSize=20
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<GetResponse>> Get([FromQuery] GetRequest request)
        {
            _logger.LogInformation("Fetching reviews");
            var reviews = await _mediator.Send(request);
            return Ok(reviews);
        }

        // GET api/<ReviewsController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching review with ID: {id}", id);
            var review = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(review);
        }

        // POST api/<ReviewsController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            var userId = GetCurrentUserId();
            request.UserId = userId;
            _logger.LogInformation("Adding a new review for user {userId}", userId);
            var review = await _mediator.Send(request);
            return Ok(review);
        }

        // PUT api/<ReviewsController>/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            var userId = GetCurrentUserId();
            request.Id = id;
            request.UserId = userId;
            _logger.LogInformation("Updating review with ID: {id} for user {userId}", id, userId);
            var review = await _mediator.Send(request);
            return Ok(review);
        }

        // DELETE api/<ReviewsController>/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Deleting review with ID: {id} for user {userId}", id, userId);
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
