using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using PaddleThroughLychnidos.Application.User.Commands;
using PaddleThroughLychnidos.Application.User.Queries;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Shared;
using System.Net;
using System.Security.Claims;

namespace PaddleThroughLychnidos.API.Controllers
{
    [Route("api/admin/users")]
    [ApiController]
    [Authorize(Roles = "Administrator")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AdminUsersController> _logger;

        public AdminUsersController(IMediator mediator, ILogger<AdminUsersController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/admin/users?pageNumber=1&pageSize=20&search=&roleFilter=Artisan
        [HttpGet]
        public async Task<ActionResult<GetAllResponse>> GetAll(
            [FromQuery] int? pageNumber,
            [FromQuery] int? pageSize,
            [FromQuery] string? search,
            [FromQuery] UserRole? roleFilter)
        {
            var response = await _mediator.Send(new GetAllRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Search = search,
                RoleFilter = roleFilter,
            });
            return Ok(response);
        }

        // POST api/admin/users
        [HttpPost]
        public async Task<ActionResult<AdminCreateResponse>> Create([FromBody] AdminCreateRequest request)
        {
            var adminId = GetCurrentUserId();
            _logger.LogInformation("Admin {adminId} creating user {username}", adminId, request.Username);
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        // PUT api/admin/users/5/role
        [HttpPut("{id:int}/role")]
        public async Task<ActionResult<UpdateRoleResponse>> UpdateRole(int id, [FromBody] UpdateRoleBody body)
        {
            var adminId = GetCurrentUserId();
            _logger.LogInformation("Admin {adminId} changing user {id} role to {role}", adminId, id, body.NewRole);
            var response = await _mediator.Send(new UpdateRoleRequest
            {
                UserId = id,
                NewRole = body.NewRole,
                RequestingAdminId = adminId,
            });
            return Ok(response);
        }

        // DELETE api/admin/users/5
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<AdminDeleteResponse>> Delete(int id)
        {
            var adminId = GetCurrentUserId();
            _logger.LogInformation("Admin {adminId} deleting user {id}", adminId, id);
            var response = await _mediator.Send(new AdminDeleteRequest
            {
                UserId = id,
                RequestingAdminId = adminId,
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

    public class UpdateRoleBody
    {
        public UserRole NewRole { get; set; }
    }
}
