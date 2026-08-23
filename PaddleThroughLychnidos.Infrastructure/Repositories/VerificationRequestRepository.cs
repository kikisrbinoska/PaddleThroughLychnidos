using Microsoft.EntityFrameworkCore;
using PaddleThroughLychnidos.Domain.Entities;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Infrastructure.Data.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaddleThroughLychnidos.Infrastructure.Repositories
{
    public class VerificationRequestRepository : GenericRepository<VerificationRequest>, IVerificationRequestRepository
    {
        public VerificationRequestRepository(ApplicationDbContext context) : base(context, context.VerificationRequests)
        {
        }

        public async Task<VerificationRequest?> GetPendingByShopIdAsync(int shopId)
        {
            return await _context.VerificationRequests
                .Where(r => r.ShopId == shopId && r.Status == VerificationStatus.Pending)
                .OrderByDescending(r => r.SubmittedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<List<VerificationRequest>> GetPagedByStatusAsync(VerificationStatus status)
        {
            return await _context.VerificationRequests
                .Include(r => r.Shop)
                    .ThenInclude(s => s.Owner)
                .Include(r => r.Shop)
                    .ThenInclude(s => s.Category)
                .Include(r => r.ReviewedByAdmin)
                .Where(r => r.Status == status)
                .OrderByDescending(r => r.SubmittedAt)
                .ThenByDescending(r => r.Id)
                .ToListAsync();
        }

        public async Task<int> GetCountByStatusAsync(VerificationStatus status)
        {
            return await _context.VerificationRequests.CountAsync(r => r.Status == status);
        }
    }
}
