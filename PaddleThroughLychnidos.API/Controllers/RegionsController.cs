using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.Region.Comands;
using PaddleThroughLychnidos.Application.Region.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<RegionsController> _logger;

        public RegionsController(IMediator mediator, ILogger<RegionsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/<RegionsController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<GetResponse>>> Get()
        {
            _logger.LogInformation("Fetching all regions");
            var regions = await _mediator.Send(new GetRequest());
            return Ok(regions);
        }

        // GET api/<RegionsController>/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching region with ID: {id}", id);
            var region = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(region);
        }

        // GET api/regions/admin - includes ShopCount/ItineraryCount per
        // region, for the Manage Regions admin screen.
        [HttpGet("admin")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<List<GetForAdminResponse>>> GetForAdmin()
        {
            _logger.LogInformation("Fetching regions for admin management");
            var regions = await _mediator.Send(new GetForAdminRequest());
            return Ok(regions);
        }

        // POST api/<RegionsController>
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<AddResponse>> Add([FromBody] AddRequest request)
        {
            _logger.LogInformation("Adding a new region");
            var region = await _mediator.Send(request);
            return Ok(region);
        }

        // PUT api/<RegionsController>/5
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<EditResponse>> Put(int id, [FromBody] EditRequest request)
        {
            _logger.LogInformation("Updating region with ID: {id}", id);
            request.Id = id;
            var region = await _mediator.Send(request);
            return Ok(region);
        }

        // DELETE api/<RegionsController>/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<DeleteResponse>> Delete(int id)
        {
            _logger.LogInformation("Deleting region with ID: {id}", id);
            var response = await _mediator.Send(new DeleteRequest { Id = id });
            return Ok(response);
        }

        // POST api/regions/backfill-shops - one-time fix-up for shops
        // (mainly bulk-imported ones) that have coordinates but were never
        // matched to a region. Safe to run repeatedly.
        [HttpPost("backfill-shops")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<BackfillShopRegionsResponse>> BackfillShops()
        {
            _logger.LogInformation("Backfilling RegionId for shops missing one");
            var response = await _mediator.Send(new BackfillShopRegionsRequest());
            return Ok(response);
        }
    }
}
