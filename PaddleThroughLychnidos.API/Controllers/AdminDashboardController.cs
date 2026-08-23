using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.Admin.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/admin/dashboard-stats")]
    [ApiController]
    [Authorize(Roles = "Administrator")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AdminDashboardController> _logger;

        public AdminDashboardController(IMediator mediator, ILogger<AdminDashboardController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/admin/dashboard-stats
        [HttpGet]
        public async Task<ActionResult<GetDashboardStatsResponse>> Get()
        {
            _logger.LogInformation("Fetching admin dashboard stats");
            var response = await _mediator.Send(new GetDashboardStatsRequest());
            return Ok(response);
        }
    }
}
