using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.VerificationRequest.Commands;
using PaddleThroughLychnidos.Application.VerificationRequest.Queries;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/admin/verification")]
    [ApiController]
    [Authorize(Roles = "Administrator")]
    public class AdminVerificationController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AdminVerificationController> _logger;

        public AdminVerificationController(IMediator mediator, ILogger<AdminVerificationController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/admin/verification/pending?status=Approved
        [HttpGet("pending")]
        public async Task<ActionResult<GetPendingResponse>> GetPending([FromQuery] GetPendingRequest request)
        {
            _logger.LogInformation("Fetching verification requests ({status}) for admin review", request.Status);
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        // POST api/admin/verification/5/approve
        [HttpPost("{id:int}/approve")]
        public async Task<ActionResult<ApproveResponse>> Approve(int id)
        {
            var adminId = GetCurrentUserId();
            _logger.LogInformation("Admin {adminId} approving verification request {id}", adminId, id);
            var response = await _mediator.Send(new ApproveRequest { RequestId = id, AdminId = adminId });
            return Ok(response);
        }

        // POST api/admin/verification/5/reject
        [HttpPost("{id:int}/reject")]
        public async Task<ActionResult<RejectResponse>> Reject(int id, [FromBody] RejectVerificationBody body)
        {
            var adminId = GetCurrentUserId();
            _logger.LogInformation("Admin {adminId} rejecting verification request {id}", adminId, id);
            var response = await _mediator.Send(new RejectRequest { RequestId = id, AdminId = adminId, Reason = body.Reason });
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

    public class RejectVerificationBody
    {
        public string Reason { get; set; } = string.Empty;
    }
}
