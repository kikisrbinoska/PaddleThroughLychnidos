using MediatR;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    public class UpdateRoleRequest : IRequest<UpdateRoleResponse>
    {
        public int UserId { get; set; }
        public UserRole NewRole { get; set; }

        // Never trust a client-supplied value here - the controller
        // overwrites this from the authenticated admin's JWT claims before
        // dispatching. Used to block an admin from demoting themselves.
        public int RequestingAdminId { get; set; }
    }
}
