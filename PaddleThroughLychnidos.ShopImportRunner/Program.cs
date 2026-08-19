using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PaddleThroughLychnidos.Application;
using PaddleThroughLychnidos.Application.ShopImport.Commands;
using PaddleThroughLychnidos.Infrastructure;

if (args.Length != 1)
{
    Console.WriteLine("Usage: dotnet run -- <path-to-ohrid-shops-CLEANED.json>");
    return 1;
}

var filePath = Path.GetFullPath(args[0]);

var configuration = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: false)
    .AddEnvironmentVariables()
    .Build();

var services = new ServiceCollection();
services.AddApplication();
services.AddInfrastructure(configuration);

await using var provider = services.BuildServiceProvider();
var mediator = provider.GetRequiredService<IMediator>();

Console.WriteLine($"Importing Ohrid shops from: {filePath}");

var result = await mediator.Send(new ImportOhridShopsRequest { FilePath = filePath });

Console.WriteLine();
Console.WriteLine("=== Import Summary ===");
Console.WriteLine($"Total records read:            {result.TotalRead}");
Console.WriteLine($"Total inserted:                {result.TotalInserted}");
Console.WriteLine($"Total skipped (duplicates):    {result.TotalSkippedDuplicates}");
Console.WriteLine($"Total skipped (no category):   {result.TotalSkippedMissingCategory}");
Console.WriteLine($"Total skipped (not OPERATIONAL): {result.TotalSkippedNotOperational}");

if (result.ShopsWithMultipleCategories.Count > 0)
{
    Console.WriteLine();
    Console.WriteLine($"Shops with multiple matched categories ({result.ShopsWithMultipleCategories.Count}) — review manually:");
    foreach (var entry in result.ShopsWithMultipleCategories)
    {
        Console.WriteLine($"  - {entry}");
    }
}

if (result.Warnings.Count > 0)
{
    Console.WriteLine();
    Console.WriteLine($"Warnings ({result.Warnings.Count}):");
    foreach (var warning in result.Warnings)
    {
        Console.WriteLine($"  - {warning}");
    }
}

return 0;
