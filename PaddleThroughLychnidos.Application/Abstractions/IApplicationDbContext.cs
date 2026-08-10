using Microsoft.EntityFrameworkCore;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Application.Abstractions
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
