using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaddleThroughLychnidos.Application.NewsItem.Queries;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<NewsController> _logger;

        public NewsController(IMediator mediator, ILogger<NewsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/news?category=CurrentEvent
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<GetPagedResponse>> Get([FromQuery] GetPagedRequest request)
        {
            _logger.LogInformation("Fetching news items for category {category}", request.Category);
            var news = await _mediator.Send(request);
            return Ok(news);
        }

        // GET api/news/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdResponse>> Get(int id)
        {
            _logger.LogInformation("Fetching news item with ID: {id}", id);
            var news = await _mediator.Send(new GetByIdRequest { Id = id });
            return Ok(news);
        }
    }
}
