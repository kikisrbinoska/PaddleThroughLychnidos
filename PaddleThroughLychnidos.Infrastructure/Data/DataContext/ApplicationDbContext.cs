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
        public DbSet<Itinerary> Itineraries { get; set; } = null!;
        public DbSet<ItineraryStop> ItineraryStops { get; set; } = null!;
        public DbSet<TravelPlanItem> TravelPlanItems { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema(Schemas.Default);

            modelBuilder.Entity<User>(builder =>
            {
                builder.Property(u => u.Role).HasConversion<string>();

                builder.HasIndex(u => u.Username).IsUnique();
                builder.HasIndex(u => u.Email).IsUnique();
            });

            modelBuilder.Entity<Region>(builder =>
            {
                // Id=7 is reserved for Zaum Monastery, to be added once its
                // GeoJSON polygon is available.
                builder.HasData(
                    new Region
                    {
                        Id = 1,
                        Name = "Varosh - Old Town of Ohrid - 6000 Ohrid, North Macedonia",
                        Description = string.Empty,
                        PolygonGeoJson = "{\"type\":\"Polygon\",\"coordinates\":[[[20.787599,41.114936],[20.788264,41.109979],[20.799301,41.111026],[20.800473,41.113924],[20.794001,41.116244],[20.789311,41.115731],[20.787599,41.114936]]]}",
                    },
                    new Region
                    {
                        Id = 2,
                        Name = "Old Bazaar (Čaršija) - 6000 Ohrid, North Macedonia",
                        Description = string.Empty,
                        PolygonGeoJson = "{\"type\":\"Polygon\",\"coordinates\":[[[20.799199,41.112732],[20.800338,41.113574],[20.800338,41.113574],[20.802225,41.116929],[20.79801,41.116943],[20.799199,41.112732]]]}",
                    },
                    new Region
                    {
                        Id = 3,
                        Name = "Plaošnik / Kaneo - 6000 Ohrid, North Macedonia",
                        Description = string.Empty,
                        PolygonGeoJson = "{\"type\":\"Polygon\",\"coordinates\":[[[20.791895,41.113603],[20.788127,41.113732],[20.78826,41.110899],[20.792445,41.11051],[20.792447,41.11052],[20.791895,41.113603]]]}",
                    },
                    new Region
                    {
                        Id = 4,
                        Name = "St. Naum Monastery - Ohrid Lake, North Macedonia",
                        Description = string.Empty,
                        PolygonGeoJson = "{\"type\":\"Polygon\",\"coordinates\":[[[20.732367,40.91161],[20.746379,40.908202],[20.74673,40.907989],[20.746769,40.907947],[20.760209,40.914992],[20.760223,40.914952],[20.745256,40.915788],[20.745323,40.915754],[20.732339,40.91165],[20.732367,40.91161]]]}",
                    },
                    new Region
                    {
                        Id = 5,
                        Name = "Bay of Bones (Museum on Water) - Ohrid Lake, North Macedonia",
                        Description = string.Empty,
                        PolygonGeoJson = "{\"type\":\"Polygon\",\"coordinates\":[[[20.800361,40.993928],[20.801592,40.996752],[20.801571,40.996706],[20.801584,40.996697],[20.796341,40.996917],[20.796344,40.996909],[20.796153,40.993998],[20.796163,40.99399],[20.800359,40.993935],[20.800361,40.993928]]]}",
                    },
                    new Region
                    {
                        Id = 6,
                        Name = "Ohrid Lakefront Promenade - 6000 Ohrid, North Macedonia",
                        Description = string.Empty,
                        PolygonGeoJson = "{\"type\":\"Polygon\",\"coordinates\":[[[20.735171,40.914576],[20.777828,40.912398],[20.777252,40.911744],[20.777375,40.911598],[20.84729,41.030999],[20.847329,41.030958],[20.802615,41.106184],[20.80274,41.105997],[20.735171,40.914576]]]}",
                    }
                );
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

            modelBuilder.Entity<Itinerary>(builder =>
            {
                builder.Property(i => i.Difficulty).HasConversion<string>();

                builder.HasOne(i => i.Region)
                    .WithMany()
                    .HasForeignKey(i => i.RegionId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(i => i.RegionId);
            });

            modelBuilder.Entity<ItineraryStop>(builder =>
            {
                builder.HasOne(s => s.Itinerary)
                    .WithMany(i => i.Stops)
                    .HasForeignKey(s => s.ItineraryId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(s => s.Shop)
                    .WithMany(sh => sh.ItineraryStops)
                    .HasForeignKey(s => s.ShopId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(s => s.ItineraryId);
                builder.HasIndex(s => s.ShopId);
                builder.HasIndex(s => new { s.ItineraryId, s.Order }).IsUnique();
            });

            modelBuilder.Entity<TravelPlanItem>(builder =>
            {
                builder.HasOne(t => t.User)
                    .WithMany(u => u.TravelPlan)
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(t => t.Shop)
                    .WithMany()
                    .HasForeignKey(t => t.ShopId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(t => t.Itinerary)
                    .WithMany()
                    .HasForeignKey(t => t.ItineraryId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(t => t.UserId);
                builder.HasIndex(t => t.ShopId);
                builder.HasIndex(t => t.ItineraryId);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
