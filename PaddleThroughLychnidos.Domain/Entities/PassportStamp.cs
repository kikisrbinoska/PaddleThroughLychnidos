using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    // Earned the first time a user submits a review for a shop - our proxy
    // for "visited" in the absence of a GPS check-in system. One per
    // (UserId, ShopId) pair, enforced by a unique index (see
    // ApplicationDbContext) and by Review.Commands.AddHandler only creating
    // one when none already exists. Not removed if the review is later
    // deleted - see Review.Commands.DeleteHandler.
    public class PassportStamp : IEntity
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int ShopId { get; set; }
        public Shop Shop { get; set; } = null!;

        public DateTime VisitedAt { get; set; }
    }
}
