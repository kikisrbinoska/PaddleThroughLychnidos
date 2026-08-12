using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.User.Commands;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(IMediator mediator, ILogger<RegisterController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // POST api/<RegisterController>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<AddResponse>> Register([FromBody] AddRequest request)
        {
            _logger.LogInformation("Registering a new user");
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}
