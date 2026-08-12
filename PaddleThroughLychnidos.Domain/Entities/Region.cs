using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PaddleThroughLychnidos.Domain.Shared;

namespace PaddleThroughLychnidos.Domain.Entities
{
    public class Region : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PolygonGeoJson { get; set; } = string.Empty;

        public ICollection<Shop> Shops { get; set; } = new List<Shop>();
    }
}
