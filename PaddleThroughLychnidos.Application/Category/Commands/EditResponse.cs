namespace PaddleThroughLychnidos.Application.Category.Commands
{
    public class EditResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
