namespace PaddleThroughLychnidos.Infrastructure.YouTube
{
    // Best-effort keyword match of a Crafts video's title against the
    // seeded Category names (see ApplicationDbContext.OnModelCreating) - used
    // to set LearnVideo.RelatedCategoryId at fetch time so the video detail
    // page can show "related shops" without manual curation. A title
    // matching no keyword below simply gets no related shops.
    public static class CraftCategoryMatcher
    {
        private static readonly (string CategoryName, string[] Keywords)[] KeywordsByCategory =
        {
            ("WoodCarving", new[] { "wood carving", "woodcarving", "wood-carving", "carving" }),
            ("Jewelry", new[] { "filigree", "filigran", "jewelry", "jewellery", "бисер", "silver" }),
            ("HandmadePaper", new[] { "paper making", "papermaking", "handmade paper" }),
            ("TraditionalCostume", new[] { "embroidery", "embroider", "costume", "носија" }),
            ("Iconography", new[] { "icon painting", "iconography", "icon-painting" }),
        };

        /// <summary>Returns the matched Category.Name, or null if no keyword matched the title.</summary>
        public static string? MatchCategoryName(string title)
        {
            var lowered = title.ToLowerInvariant();

            foreach (var (categoryName, keywords) in KeywordsByCategory)
            {
                if (keywords.Any(keyword => lowered.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
                {
                    return categoryName;
                }
            }

            return null;
        }
    }
}
