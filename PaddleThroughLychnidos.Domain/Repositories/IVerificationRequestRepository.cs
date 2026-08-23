using PaddleThroughLychnidos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Domain.Repositories
{
    public interface IVerificationRequestRepository : IRepository<VerificationRequest>
    {
        public Task<VerificationRequest?> GetPendingByShopIdAsync(int shopId);
        public Task<List<VerificationRequest>> GetPagedByStatusAsync(VerificationStatus status);
        public Task<int> GetCountByStatusAsync(VerificationStatus status);
    }
}
