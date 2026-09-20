using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using PaddleThroughLychnidos.Application.Abstractions;

namespace PaddleThroughLychnidos.Infrastructure.Files
{
    // Saves uploads to wwwroot/uploads/{subfolder}/ on local disk, served
    // back out via ASP.NET's static file middleware (see
    // Program.cs app.UseStaticFiles()). Chosen over cloud blob storage for
    // this iteration - see task discussion; would need revisiting before a
    // real multi-instance production deploy, since local disk isn't shared
    // across instances.
    public class LocalFileUploadService : IFileUploadService
    {
        // Matches ArtisanController's [RequestSizeLimit(10_000_000)] on the
        // single-file upload endpoints exactly - a mismatch here meant
        // files between ~9.5 and 10 MiB could be rejected by Kestrel before
        // ever reaching this check, with a much less useful error.
        private const long MaxFileSizeBytes = 10_000_000;

        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".webp", ".pdf",
        };

        private readonly IWebHostEnvironment _environment;

        public LocalFileUploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveAsync(IFormFile file, string subfolder, CancellationToken cancellationToken)
        {
            if (file.Length == 0)
            {
                throw new ArgumentException("File is empty.", nameof(file));
            }

            if (file.Length > MaxFileSizeBytes)
            {
                throw new ArgumentException("File exceeds the 10 MB upload limit.", nameof(file));
            }

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedExtensions.Contains(extension))
            {
                throw new ArgumentException($"File type '{extension}' is not allowed.", nameof(file));
            }

            var webRootPath = _environment.WebRootPath
                ?? Path.Combine(_environment.ContentRootPath, "wwwroot");

            var uploadsDirectory = Path.Combine(webRootPath, "uploads", subfolder);
            Directory.CreateDirectory(uploadsDirectory);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsDirectory, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            return $"/uploads/{subfolder}/{fileName}";
        }
    }
}
