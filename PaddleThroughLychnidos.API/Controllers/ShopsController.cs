using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.Shop.Commands;
using PaddleThroughLychnidos.Application.Shop.Queries;
using System.Security.Claims;
using ReviewQueries = PaddleThroughLychnidos.Application.Review.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ShopsController> _logger;

        public ShopsController(IMediator mediator, ILogger<ShopsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<ShopsController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<GetPagedResponse>> Get([FromQuery] GetPagedRequest request)
        {
            _logger.LogInformation("Fetching all shops");
            var shops = await _mediator.Send(request);
            return Ok(shops);
        }

        // GET api/<ShopsController>/open-now
        [HttpGet("open-now")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ShopListItem>>> GetOpenNow([FromQuery] GetOpenNowRequest request)
        {
            _logger.LogInformation("Fetching shops open now");
            var shops = await _mediator.Send(request);
            return Ok(shops);
        }

        // GET api/<ShopsController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching shop with ID: {id}", id);
            // Optional - lets a logged-in owner/admin preview a Pending or
            // Rejected shop that would otherwise 404 for the public (see
            // Shop.Queries.GetByIdHandler). Anonymous requests just get null.
            var requestingUserId = TryGetCurrentUserId();
            var shop = await _mediator.Send(new GetByIdRequest { Id = id, RequestingUserId = requestingUserId });
            return Ok(shop);
        }

        // GET api/<ShopsController>/5/reviews?pageNumber=1&pageSize=20
        [HttpGet("{shopId:int}/reviews")]
        [AllowAnonymous]
        public async Task<ActionResult<ReviewQueries.GetResponse>> GetReviews(int shopId, [FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            _logger.LogInformation("Fetching reviews for shop {shopId}", shopId);
            var reviews = await _mediator.Send(new ReviewQueries.GetRequest { ShopId = shopId, PageNumber = pageNumber, PageSize = pageSize });
            return Ok(reviews);
        }

        // POST api/<ShopsController> - Administrator-only direct creation
        // (e.g. tooling/import flows). Artisans create shops via
        // POST /api/artisan/shop instead, which enforces the Pending
        // approval workflow.
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            var userId = GetCurrentUserId();
            request.OwnerId = request.OwnerId > 0 ? request.OwnerId : userId;
            _logger.LogInformation("Adding a new shop");
            var shop = await _mediator.Send(request);
            return Ok(shop);
        }

        // PUT api/<ShopsController>/5 - Administrator-only direct edit.
        // Artisans edit their own shop via PUT /api/artisan/shop/{id}.
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            var userId = GetCurrentUserId();
            request.Id = id;
            request.RequestingUserId = userId;
            _logger.LogInformation("Updating shop with ID: {id}", id);
            var shop = await _mediator.Send(request);
            return Ok(shop);
        }

        // DELETE api/<ShopsController>/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            _logger.LogInformation("Deleting shop with ID: {id}", id);
            var response = await _mediator.Send(new DeleteRequest { Id = id });
            return Ok(response);
        }

        private int? TryGetCurrentUserId()
        {
            var value = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            return value is not null && int.TryParse(value, out var userId) ? userId : null;
        }

        private int GetCurrentUserId()
        {
            return TryGetCurrentUserId() ?? 0;
        }
    }
}
