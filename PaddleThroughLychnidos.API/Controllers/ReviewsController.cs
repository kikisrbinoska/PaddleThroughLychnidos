using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.Review.Commands;
using PaddleThroughLychnidos.Application.Review.Queries;

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

        // GET: api/<ReviewsController>?shopId=5&userId=2
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<GetResponse>>> Get([FromQuery] GetRequest request)
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
            _logger.LogInformation("Adding a new review");
            var review = await _mediator.Send(request);
            return Ok(review);
        }

        // PUT api/<ReviewsController>/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            _logger.LogInformation("Updating review with ID: {id}", id);
            request.Id = id;
            var review = await _mediator.Send(request);
            return Ok(review);
        }

        // DELETE api/<ReviewsController>/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            _logger.LogInformation("Deleting review with ID: {id}", id);
            var response = await _mediator.Send(new DeleteRequest { Id = id });
            return Ok(response);
        }
    }
}
