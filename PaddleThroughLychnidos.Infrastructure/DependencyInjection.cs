using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PaddleThroughLychnidos.Application.Abstractions;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Infrastructure.Authentication;
using PaddleThroughLychnidos.Infrastructure.Data.DataContext;
using PaddleThroughLychnidos.Infrastructure.Repositories;

namespace PaddleThroughLychnidos.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("Database")));

            services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IShopRepository, ShopRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IRegionRepository, RegionRepository>();
            services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<IProductVideoRepository, ProductVideoRepository>();
            services.AddScoped<IShopImageRepository, ShopImageRepository>();
            services.AddScoped<IItineraryRepository, ItineraryRepository>();
            services.AddScoped<IItineraryStopRepository, ItineraryStopRepository>();
            services.AddScoped<ITravelPlanItemRepository, TravelPlanItemRepository>();

            services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
            services.AddScoped<IAuthService, AuthService>();

            return services;
        }
    }
}
