using Microsoft.EntityFrameworkCore;
using PaddleThroughLychnidos.Application.Abstractions;
using PaddleThroughLychnidos.Domain.Entities;

namespace PaddleThroughLychnidos.Infrastructure.Data.DataContext
{
    public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options), IApplicationDbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Shop> Shops { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Region> Regions { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<ShopImage> ShopImages { get; set; } = null!;
        public DbSet<ProductVideo> ProductVideos { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema(Schemas.Default);

            modelBuilder.Entity<User>(builder =>
            {
                builder.Property(u => u.Role).HasConversion<string>();

                builder.HasIndex(u => u.Username).IsUnique();
                builder.HasIndex(u => u.Email).IsUnique();
            });

            modelBuilder.Entity<Shop>(builder =>
            {
                builder.HasOne(s => s.Owner)
                    .WithMany(u => u.Shops)
                    .HasForeignKey(s => s.OwnerId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(s => s.Region)
                    .WithMany(r => r.Shops)
                    .HasForeignKey(s => s.RegionId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(s => s.Category)
                    .WithMany(c => c.Shops)
                    .HasForeignKey(s => s.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(s => s.OwnerId);
                builder.HasIndex(s => s.RegionId);
                builder.HasIndex(s => s.CategoryId);
            });

            modelBuilder.Entity<ShopImage>(builder =>
            {
                builder.HasOne(si => si.Shop)
                    .WithMany(s => s.Images)
                    .HasForeignKey(si => si.ShopId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasIndex(si => si.ShopId);
            });

            modelBuilder.Entity<Product>(builder =>
            {
                builder.HasOne(p => p.Shop)
                    .WithMany(s => s.Products)
                    .HasForeignKey(p => p.ShopId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasIndex(p => p.ShopId);
            });

            modelBuilder.Entity<ProductVideo>(builder =>
            {
                builder.HasOne(pv => pv.Product)
                    .WithMany(p => p.Videos)
                    .HasForeignKey(pv => pv.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasIndex(pv => pv.ProductId);
            });

            modelBuilder.Entity<Review>(builder =>
            {
                builder.HasOne(r => r.Shop)
                    .WithMany(s => s.Reviews)
                    .HasForeignKey(r => r.ShopId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(r => r.User)
                    .WithMany()
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasIndex(r => r.ShopId);
                builder.HasIndex(r => r.UserId);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
