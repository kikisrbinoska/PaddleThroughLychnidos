namespace PaddleThroughLychnidos.Application.Region.Comands
{
    public class BackfillShopRegionsResponse
    {
        public int TotalUnassignedChecked { get; set; }
        public int TotalMatched { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
