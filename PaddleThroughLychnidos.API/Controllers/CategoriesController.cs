using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.Category.Commands;
using PaddleThroughLychnidos.Application.Category.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(IMediator mediator, ILogger<CategoriesController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<CategoriesController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<GetResponse>>> Get()
        {
            _logger.LogInformation("Fetching all categories");
            var categories = await _mediator.Send(new GetRequest());
            return Ok(categories);
        }

        // GET api/<CategoriesController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching category with ID: {id}", id);
            var category = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(category);
        }

        // POST api/<CategoriesController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            _logger.LogInformation("Adding a new category");
            var category = await _mediator.Send(request);
            return Ok(category);
        }

        // PUT api/<CategoriesController>/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            _logger.LogInformation("Updating category with ID: {id}", id);
            request.Id = id;
            var category = await _mediator.Send(request);
            return Ok(category);
        }

        // DELETE api/<CategoriesController>/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            _logger.LogInformation("Deleting category with ID: {id}", id);
            var response = await _mediator.Send(new DeleteRequest { Id = id });
            return Ok(response);
        }
    }
}
