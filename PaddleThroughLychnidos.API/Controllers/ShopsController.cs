using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.Shop.Commands;
using PaddleThroughLychnidos.Application.Shop.Queries;

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

        // GET api/<ShopsController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching shop with ID: {id}", id);
            var shop = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(shop);
        }

        // POST api/<ShopsController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            _logger.LogInformation("Adding a new shop");
            var shop = await _mediator.Send(request);
            return Ok(shop);
        }

        // PUT api/<ShopsController>/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            _logger.LogInformation("Updating shop with ID: {id}", id);
            request.Id = id;
            var shop = await _mediator.Send(request);
            return Ok(shop);
        }

        // DELETE api/<ShopsController>/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            _logger.LogInformation("Deleting shop with ID: {id}", id);
            var response = await _mediator.Send(new DeleteRequest { Id = id });
            return Ok(response);
        }
    }
}
