namespace PaddleThroughLychnidos.Application.ShopImport.Commands
{
    public class ImportOhridShopsResponse
    {
        public int TotalRead { get; set; }
        public int TotalInserted { get; set; }
        public int TotalSkippedDuplicates { get; set; }
        public int TotalSkippedMissingCategory { get; set; }
        public int TotalSkippedNotOperational { get; set; }
        public List<string> ShopsWithMultipleCategories { get; set; } = new();
        public List<string> Warnings { get; set; } = new();
    }
}
