using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.Itinerary.Commands;
using PaddleThroughLychnidos.Application.Itinerary.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItinerariesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ItinerariesController> _logger;

        public ItinerariesController(IMediator mediator, ILogger<ItinerariesController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<ItinerariesController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<GetPagedResponse>> Get([FromQuery] GetPagedRequest request)
        {
            _logger.LogInformation("Fetching all itineraries");
            var itineraries = await _mediator.Send(request);
            return Ok(itineraries);
        }

        // GET api/<ItinerariesController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching itinerary with ID: {id}", id);
            var itinerary = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(itinerary);
        }

        // POST api/<ItinerariesController>
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<CreateResponse>> Post([FromBody] CreateRequest request)
        {
            _logger.LogInformation("Creating a new itinerary");
            var itinerary = await _mediator.Send(request);
            return Ok(itinerary);
        }
    }
}
