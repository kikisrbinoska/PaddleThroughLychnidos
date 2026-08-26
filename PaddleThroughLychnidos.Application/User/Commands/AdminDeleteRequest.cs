using MediatR;

namespace PaddleThroughLychnidos.Application.User.Commands
{
    /// <summary>
    /// Admin-only account deletion (DELETE /api/admin/users/{id}). Distinct
    /// from User.Commands.DeleteRequest (self-service account deletion) so
    /// the self-lockout and owned-shop guards only apply to the admin flow.
    /// </summary>
    public class AdminDeleteRequest : IRequest<AdminDeleteResponse>
    {
        public int UserId { get; set; }

        // Never trust a client-supplied value here - the controller
        // overwrites this from the authenticated admin's JWT claims before
        // dispatching. Used to block an admin from deleting themselves.
        public int RequestingAdminId { get; set; }
    }
}
