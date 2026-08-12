using Microsoft.EntityFrameworkCore;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.Abstractions
{
    public interface IApplicationDbContext
    {
        DbSet<PaddleThroughLychnidos.Domain.Entities.User> Users { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
