using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.Product.Commands;
using PaddleThroughLychnidos.Application.Product.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<ProductsController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<GetPagedResponse>> Get([FromQuery] GetPagedRequest request)
        {
            _logger.LogInformation("Fetching all products");
            var products = await _mediator.Send(request);
            return Ok(products);
        }

        // GET api/<ProductsController>/5
        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching product with ID: {id}", id);
            var product = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(product);
        }

        // POST api/<ProductsController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            var userId = GetCurrentUserId();
            request.RequestingUserId = userId;
            _logger.LogInformation("Adding a new product for user {userId}", userId);
            var product = await _mediator.Send(request);

            return Ok(product);
        }

        // PUT api/<ProductsController>/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            var userId = GetCurrentUserId();
            request.Id = id;
            request.RequestingUserId = userId;
            _logger.LogInformation("Updating product with ID: {id} for user {userId}", id, userId);
            var product = await _mediator.Send(request);
            return Ok(product);
        }

        // DELETE api/<ProductsController>/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Deleting product with ID: {id} for user {userId}", id, userId);
            var response = await _mediator.Send(new DeleteRequest { Id = id, RequestingUserId = userId });
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
