using MediatR;

namespace PaddleThroughLychnidos.Application.ShopImport.Commands
{
    public class ImportOhridShopsRequest : IRequest<ImportOhridShopsResponse>
    {
        public string FilePath { get; set; } = string.Empty;
    }
}
