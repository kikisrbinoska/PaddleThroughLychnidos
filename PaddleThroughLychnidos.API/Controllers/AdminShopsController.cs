using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.Shop.Commands;
using PaddleThroughLychnidos.Application.Shop.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/admin/shops")]
    [ApiController]
    [Authorize(Roles = "Administrator")]
    public class AdminShopsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AdminShopsController> _logger;

        public AdminShopsController(IMediator mediator, ILogger<AdminShopsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/admin/shops/pending
        [HttpGet("pending")]
        public async Task<ActionResult<GetPendingResponse>> GetPending()
        {
            _logger.LogInformation("Fetching pending shops for admin review");
            var response = await _mediator.Send(new GetPendingRequest());
            return Ok(response);
        }

        // POST api/admin/shops/5/approve
        [HttpPost("{id:int}/approve")]
        public async Task<ActionResult<ApproveResponse>> Approve(int id)
        {
            var adminId = GetCurrentUserId();
            _logger.LogInformation("Admin {adminId} approving shop {id}", adminId, id);
            var response = await _mediator.Send(new ApproveRequest { ShopId = id, AdminId = adminId });
            return Ok(response);
        }

        // POST api/admin/shops/5/reject
        [HttpPost("{id:int}/reject")]
        public async Task<ActionResult<RejectResponse>> Reject(int id, [FromBody] RejectShopBody body)
        {
            var adminId = GetCurrentUserId();
            _logger.LogInformation("Admin {adminId} rejecting shop {id}", adminId, id);
            var response = await _mediator.Send(new RejectRequest { ShopId = id, AdminId = adminId, Reason = body.Reason });
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

    public class RejectShopBody
    {
        public string Reason { get; set; } = string.Empty;
    }
}
