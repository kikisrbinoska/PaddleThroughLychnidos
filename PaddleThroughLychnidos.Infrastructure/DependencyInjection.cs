using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PaddleThroughLychnidos.Application.Abstractions;
using PaddleThroughLychnidos.Domain.Repositories;
using PaddleThroughLychnidos.Infrastructure.Authentication;
using PaddleThroughLychnidos.Infrastructure.Data.DataContext;
using PaddleThroughLychnidos.Infrastructure.Repositories;
using PaddleThroughLychnidos.Infrastructure.Scraping;
using PaddleThroughLychnidos.Infrastructure.YouTube;
using System.Net.Http.Headers;

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
            services.AddScoped<ILearnVideoRepository, LearnVideoRepository>();
            services.AddScoped<INewsItemRepository, NewsItemRepository>();
            services.AddScoped<IPassportStampRepository, PassportStampRepository>();
            services.AddScoped<IDayPlanRepository, DayPlanRepository>();

            services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
            services.AddScoped<IAuthService, AuthService>();

            services.Configure<YouTubeSettings>(configuration.GetSection(YouTubeSettings.SectionName));
            services.AddHttpClient<IYouTubeSearchService, YouTubeSearchService>();
            services.AddHostedService<LearnVideoSyncJob>();

            services.AddHttpClient<Ohrid1ScraperSource>(ConfigureScraperClient);
            services.AddHttpClient<OhridGovMkScraperSource>(ConfigureScraperClient);
            services.AddScoped<IScraperSource>(sp => sp.GetRequiredService<Ohrid1ScraperSource>());
            services.AddScoped<IScraperSource>(sp => sp.GetRequiredService<OhridGovMkScraperSource>());
            services.AddHostedService<NewsScraperJob>();

            return services;
        }

        // Identifies the app to scraped sites (per the task's requirement to
        // set a descriptive User-Agent) and applies a generous timeout since
        // these are third-party sites outside our control.
        private static void ConfigureScraperClient(HttpClient client)
        {
            client.DefaultRequestHeaders.UserAgent.Add(
                new ProductInfoHeaderValue("PaddleThroughLychnidosNewsBot", "1.0"));
            client.DefaultRequestHeaders.UserAgent.Add(
                new ProductInfoHeaderValue("(+https://github.com/paddle-through-lychnidos; tourism news aggregator)"));
            client.Timeout = TimeSpan.FromSeconds(20);
        }
    }
}
