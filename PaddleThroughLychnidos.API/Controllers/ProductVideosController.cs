using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.ProductVideo.Commands;
using PaddleThroughLychnidos.Application.ProductVideo.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVideosController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ProductVideosController> _logger;

        public ProductVideosController(IMediator mediator, ILogger<ProductVideosController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<ProductVideosController>?productId=5
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<GetResponse>>> Get([FromQuery] GetRequest request)
        {
            _logger.LogInformation("Fetching product videos");
            var videos = await _mediator.Send(request);
            return Ok(videos);
        }

        // GET api/<ProductVideosController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching product video with ID: {id}", id);
            var video = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(video);
        }

        // POST api/<ProductVideosController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            _logger.LogInformation("Adding a new product video");
            var video = await _mediator.Send(request);
            return Ok(video);
        }

        // PUT api/<ProductVideosController>/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            _logger.LogInformation("Updating product video with ID: {id}", id);
            request.Id = id;
            var video = await _mediator.Send(request);
            return Ok(video);
        }

        // DELETE api/<ProductVideosController>/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            _logger.LogInformation("Deleting product video with ID: {id}", id);
            var response = await _mediator.Send(new DeleteRequest { Id = id });
            return Ok(response);
        }
    }
}
