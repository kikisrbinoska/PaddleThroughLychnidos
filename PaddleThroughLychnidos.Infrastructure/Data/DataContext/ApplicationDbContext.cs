using Microsoft.EntityFrameworkCore;
using PaddleThroughLychnidos.Application.Abstractions;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Infrastructure.Data.DataContext
{
    public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options), IApplicationDbContext
    {
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema(Schemas.Default);

            base.OnModelCreating(modelBuilder);
        }
    }
}
