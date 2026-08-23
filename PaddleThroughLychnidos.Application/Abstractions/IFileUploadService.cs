using Microsoft.AspNetCore.Http;

namespace PaddleThroughLychnidos.Application.Abstractions
{
    public interface IFileUploadService
    {
        /// <summary>
        /// Saves an uploaded file under the given subfolder (e.g. "shops",
        /// "verification") and returns a URL the frontend can load it from
        /// directly (relative to the API's base URL).
        /// </summary>
        Task<string> SaveAsync(IFormFile file, string subfolder, CancellationToken cancellationToken);
    }
}
