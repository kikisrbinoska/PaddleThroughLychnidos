using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class DayPlanStop : IEntity
    {
        public int Id { get; set; }

        public int DayPlanId { get; set; }
        public DayPlan DayPlan { get; set; } = null!;

        public int ShopId { get; set; }
        public Shop Shop { get; set; } = null!;

        public int Order { get; set; }
    }
}
