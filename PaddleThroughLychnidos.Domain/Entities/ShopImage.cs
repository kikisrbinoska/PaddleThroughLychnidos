using PaddleThroughLychnidos.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class ShopImage : IEntity
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public Shop Shop { get; set; } = null!;
        public string Url { get; set; } = string.Empty;
    }
}
