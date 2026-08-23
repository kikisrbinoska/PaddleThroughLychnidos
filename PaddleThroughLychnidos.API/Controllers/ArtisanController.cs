using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.Abstractions;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;
using ShopCommands = PaddleThroughLychnidos.Application.Shop.Commands;
using ShopImageCommands = PaddleThroughLychnidos.Application.ShopImage.Commands;
using ShopQueries = PaddleThroughLychnidos.Application.Shop.Queries;
using VerificationCommands = PaddleThroughLychnidos.Application.VerificationRequest.Commands;

namespace PaddleThroughLychnidos.API.Controllers
{
    // All routes here act on "my shop" - the shop owned by the
    // authenticated Artisan making the request. Ownership is always
    // derived from the JWT, never a client-supplied id, matching the
    // pattern used by TravelPlanController/ReviewsController elsewhere.
    [Route("api/artisan")]
    [ApiController]
    [Authorize(Roles = "Artisan")]
    public class ArtisanController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFileUploadService _fileUploadService;
        private readonly ILogger<ArtisanController> _logger;

        public ArtisanController(IMediator mediator, IFileUploadService fileUploadService, ILogger<ArtisanController> logger)
        {
            _mediator = mediator;
            _fileUploadService = fileUploadService;
            _logger = logger;
        }

        // GET api/artisan/my-shop
        [HttpGet("my-shop")]
        public async Task<ActionResult<ShopQueries.GetByOwnerIdResponse>> GetMyShop()
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Fetching shop for artisan {userId}", userId);
            var response = await _mediator.Send(new ShopQueries.GetByOwnerIdRequest { OwnerId = userId });
            return Ok(response);
        }

        // POST api/artisan/shop
        [HttpPost("shop")]
        public async Task<ActionResult<ShopCommands.AddResponse>> CreateShop([FromBody] ShopCommands.AddRequest request)
        {
            var userId = GetCurrentUserId();
            request.OwnerId = userId;
            _logger.LogInformation("Creating shop for artisan {userId}", userId);
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        // PUT api/artisan/shop/5
        [HttpPut("shop/{id:int}")]
        public async Task<ActionResult<ShopCommands.EditResponse>> EditShop(int id, [FromBody] ShopCommands.EditRequest request)
        {
            var userId = GetCurrentUserId();
            request.Id = id;
            request.RequestingUserId = userId;
            _logger.LogInformation("Updating shop {id} for artisan {userId}", id, userId);
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        // POST api/artisan/shop/5/resubmit
        [HttpPost("shop/{id:int}/resubmit")]
        public async Task<ActionResult<ShopCommands.ResubmitResponse>> ResubmitShop(int id)
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("Resubmitting shop {id} for artisan {userId}", id, userId);
            var response = await _mediator.Send(new ShopCommands.ResubmitRequest { ShopId = id, OwnerId = userId });
            return Ok(response);
        }

        // POST api/artisan/shop/5/images (multipart/form-data, field name "file")
        [HttpPost("shop/{id:int}/images")]
        [RequestSizeLimit(10_000_000)]
        public async Task<ActionResult<ShopImageCommands.AddResponse>> UploadShopImage(int id, IFormFile file, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();

            var myShop = await _mediator.Send(new ShopQueries.GetByOwnerIdRequest { OwnerId = userId });
            if (myShop.Shop is null || myShop.Shop.Id != id)
            {
                throw new PaddleThroughLychnidosException("You do not have permission to upload images to this shop", HttpStatusCode.Forbidden);
            }

            var url = await _fileUploadService.SaveAsync(file, "shops", cancellationToken);
            _logger.LogInformation("Uploaded image for shop {id}", id);

            var response = await _mediator.Send(new ShopImageCommands.AddRequest { ShopId = id, Url = url });
            return Ok(response);
        }

        // POST api/artisan/product-images (multipart/form-data, field name "file")
        // Saves the file and returns its URL only - not tied to a specific
        // product yet, since a product may not exist at upload time (the
        // create form uploads the image, then submits the returned URL as
        // part of Product.Commands.AddRequest.ImageUrl).
        [HttpPost("product-images")]
        [RequestSizeLimit(10_000_000)]
        public async Task<ActionResult<UploadedFileResponse>> UploadProductImage(IFormFile file, CancellationToken cancellationToken)
        {
            var url = await _fileUploadService.SaveAsync(file, "products", cancellationToken);
            _logger.LogInformation("Uploaded product image for artisan {userId}", GetCurrentUserId());
            return Ok(new UploadedFileResponse { Url = url });
        }

        // POST api/artisan/verification (multipart/form-data, field name "files")
        [HttpPost("verification")]
        [RequestSizeLimit(50_000_000)]
        public async Task<ActionResult<VerificationCommands.SubmitResponse>> SubmitVerification(
            [FromForm] int shopId,
            [FromForm] string notes,
            [FromForm] List<IFormFile> files,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();

            var documentUrls = new List<string>();
            foreach (var file in files)
            {
                var url = await _fileUploadService.SaveAsync(file, "verification", cancellationToken);
                documentUrls.Add(url);
            }

            _logger.LogInformation("Submitting verification request for shop {shopId} by artisan {userId}", shopId, userId);
            var response = await _mediator.Send(new VerificationCommands.SubmitRequest
            {
                ShopId = shopId,
                OwnerId = userId,
                Notes = notes,
                DocumentUrls = documentUrls,
            });
            return Ok(response);
        }

        private int GetCurrentUserId()
        {
            var value = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (value == null || !int.TryParse(value, out var userId))
            {
                throw new PaddleThroughLychnidosException("Invalid or missing user identity", HttpStatusCode.Unauthorized);
            }

            return userId;
        }
    }

    public class UploadedFileResponse
    {
        public string Url { get; set; } = string.Empty;
    }
}
