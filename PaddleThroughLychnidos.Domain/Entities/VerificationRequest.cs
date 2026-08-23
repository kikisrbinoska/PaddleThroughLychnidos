using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    // The "Verified Artisan" badge (Shop.IsVerified) is a separate, higher
    // trust tier from Shop.Status - a shop must already be Approved before
    // its owner can submit one of these (see
    // VerificationRequest.Commands.SubmitHandler).
    public class VerificationRequest : IEntity
    {
        public int Id { get; set; }

        public int ShopId { get; set; }
        public Shop Shop { get; set; } = null!;

        public DateTime SubmittedAt { get; set; }
        public VerificationStatus Status { get; set; } = VerificationStatus.Pending;

        public string Notes { get; set; } = string.Empty;

        // JSON-serialized List<string> of uploaded file URLs (local
        // wwwroot/uploads paths - see FileUploadService).
        public string DocumentUrlsJson { get; set; } = "[]";

        public int? ReviewedByAdminId { get; set; }
        public User? ReviewedByAdmin { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}
