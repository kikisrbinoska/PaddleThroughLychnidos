using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.LearnVideo.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/learn")]
    [ApiController]
    public class LearnController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<LearnController> _logger;

        public LearnController(IMediator mediator, ILogger<LearnController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/learn/videos?category=Crafts
        [HttpGet("videos")]
        [AllowAnonymous]
        public async Task<ActionResult<GetPagedResponse>> GetVideos([FromQuery] GetPagedRequest request)
        {
            _logger.LogInformation("Fetching learn videos for category {category}", request.Category);
            var videos = await _mediator.Send(request);
            return Ok(videos);
        }

        // GET api/learn/videos/5
        [HttpGet("videos/{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> GetVideoById(int id)
        {
            _logger.LogInformation("Fetching learn video with ID: {id}", id);
            var video = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(video);
        }
    }
}
