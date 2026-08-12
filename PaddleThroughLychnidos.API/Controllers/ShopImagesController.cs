using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.ShopImage.Commands;
using PaddleThroughLychnidos.Application.ShopImage.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopImagesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ShopImagesController> _logger;

        public ShopImagesController(IMediator mediator, ILogger<ShopImagesController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<ShopImagesController>?shopId=5
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<GetResponse>>> Get([FromQuery] GetRequest request)
        {
            _logger.LogInformation("Fetching shop images");
            var images = await _mediator.Send(request);
            return Ok(images);
        }

        // GET api/<ShopImagesController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching shop image with ID: {id}", id);
            var image = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(image);
        }

        // POST api/<ShopImagesController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            _logger.LogInformation("Adding a new shop image");
            var image = await _mediator.Send(request);
            return Ok(image);
        }

        // PUT api/<ShopImagesController>/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            _logger.LogInformation("Updating shop image with ID: {id}", id);
            request.Id = id;
            var image = await _mediator.Send(request);
            return Ok(image);
        }

        // DELETE api/<ShopImagesController>/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            _logger.LogInformation("Deleting shop image with ID: {id}", id);
            var response = await _mediator.Send(new DeleteRequest { Id = id });
            return Ok(response);
        }
    }
}
