using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedItineraries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Itineraries reference real Shop rows imported from Google Places
            // (see OhridShopsExporter) rather than HasData-seeded rows, since
            // shop IDs are runtime import data, not part of the model
            // snapshot. Coordinates/categories below were read directly from
            // the Shops table to keep each route geographically coherent.
            migrationBuilder.InsertData(
                schema: "public",
                table: "Itineraries",
                columns: new[] { "Id", "Title", "Description", "CoverImageUrl", "DurationHours", "RegionId", "Difficulty" },
                values: new object[,]
                {
                    { 1, "Pearls of the Old Bazaar", "Wander the Čaršija's jewelry lane and discover how Ohrid's famous pearls are strung by hand, from workshop to display case.", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", 2, 2, "Easy" },
                    { 2, "Varosh Silversmiths Walk", "A relaxed loop through Varosh's silver and pearl ateliers, tucked between the cathedral square and the old cobbled lanes.", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800", 3, 1, "Easy" },
                    { 3, "Sacred Kaneo & Plaošnik Trail", "Visit the churches perched above the lake at Kaneo and Plaošnik, tracing Ohrid's Byzantine heritage on foot.", "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", 4, 3, "Moderate" },
                    { 4, "Woodcarving & Icon Ateliers", "Meet the craftsmen behind Ohrid's woodcarving and icon-painting traditions, two skills passed down for generations.", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", 3, 1, "Moderate" },
                    { 5, "Art Galleries of the Old Town", "A gallery-hopping route through Varosh's small independent art spaces, framed by lake views and stone streets.", "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800", 3, 1, "Easy" },
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "ItineraryStops",
                columns: new[] { "Id", "ItineraryId", "ShopId", "Order", "Notes", "SuggestedTime" },
                values: new object[,]
                {
                    // 1. Pearls of the Old Bazaar (region 2)
                    { 1, 1, 26, 1, "Family-run pearl workshop, one of the originators of the Ohrid pearl technique.", new TimeSpan(0, 25, 0) },
                    { 2, 1, 52, 2, "Dr. Pavel Filev's pearl atelier - ask about the historic hand-stringing method.", new TimeSpan(0, 20, 0) },
                    { 3, 1, 53, 3, "Sister branch of the Filevi pearl house, a few doors down.", new TimeSpan(0, 15, 0) },
                    { 4, 1, 55, 4, "Original Ohrid Pearl Filevi - compare designs across the family's shops.", new TimeSpan(0, 15, 0) },
                    { 5, 1, 64, 5, "Risteski traditional handmade pearls, known for classic strand necklaces.", new TimeSpan(0, 20, 0) },
                    { 6, 1, 70, 6, "Stars Pearls & Silver to round out the lane before heading back to the square.", new TimeSpan(0, 15, 0) },

                    // 2. Varosh Silversmiths Walk (region 1)
                    { 7, 2, 9, 1, "Bellusso Silver & Pearls, right off the main square.", new TimeSpan(0, 20, 0) },
                    { 8, 2, 30, 2, "Gino Silver Ohrid - watch filigree work in progress most mornings.", new TimeSpan(0, 20, 0) },
                    { 9, 2, 35, 3, "Jewelry Store Goran, a small family counter with custom pieces.", new TimeSpan(0, 15, 0) },
                    { 10, 2, 72, 4, "Talevi Ohrid Pearls, a longstanding lakefront-adjacent shop.", new TimeSpan(0, 20, 0) },
                    { 11, 2, 73, 5, "Tanes Pearls & Jewellery to finish the loop back toward the old town gate.", new TimeSpan(0, 15, 0) },

                    // 3. Sacred Kaneo & Plaošnik Trail (region 3)
                    { 12, 3, 17, 1, "Church of Saint Jovan the Theologian at Kaneo - the iconic clifftop lake view.", new TimeSpan(0, 30, 0) },
                    { 13, 3, 66, 2, "Samuel's Fortress walls, a short climb with panoramic views over Ohrid.", new TimeSpan(0, 40, 0) },
                    { 14, 3, 18, 3, "Church of Saint Sophia, one of the most important Byzantine monuments in the region.", new TimeSpan(0, 35, 0) },
                    { 15, 3, 20, 4, "Church of the Virgin Mary Peribleptos, home to well-preserved medieval frescoes.", new TimeSpan(0, 30, 0) },
                    { 16, 3, 19, 5, "Church of Saints Constantine and Helen to close out the sacred sites loop.", new TimeSpan(0, 25, 0) },

                    // 4. Woodcarving & Icon Ateliers (region 1)
                    { 17, 4, 45, 1, "National Workshop For Handmade Paper - Ljupcho Panevski, papermaking demonstrations.", new TimeSpan(0, 30, 0) },
                    { 18, 4, 65, 2, "Robevci Family House, a restored merchant house showcasing period woodwork.", new TimeSpan(0, 35, 0) },
                    { 19, 4, 79, 3, "Woodcarving Gallery Tron, intricate carved iconostasis panels on display.", new TimeSpan(0, 25, 0) },
                    { 20, 4, 33, 4, "Icon Gallery of Ohrid, traditional egg-tempera icon painting.", new TimeSpan(0, 25, 0) },
                    { 21, 4, 6, 5, "Atelier Anastas Dudan, a working woodcarving studio open to visitors.", new TimeSpan(0, 25, 0) },

                    // 5. Art Galleries of the Old Town (region 1)
                    { 22, 5, 47, 1, "Nomadica by Biljana, contemporary mixed-media pieces inspired by the lake.", new TimeSpan(0, 20, 0) },
                    { 23, 5, 29, 2, "Gallery Marta Pejoska, local landscape painting.", new TimeSpan(0, 20, 0) },
                    { 24, 5, 69, 3, "SRNA, a small curated gallery just off the bazaar.", new TimeSpan(0, 15, 0) },
                    { 25, 5, 22, 4, "Collarette Ohrid, jewelry-adjacent art pieces and accessories.", new TimeSpan(0, 15, 0) },
                    { 26, 5, 71, 5, "Stojan Stojanovski Gallery Shop to end the walk near the bazaar entrance.", new TimeSpan(0, 20, 0) },
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM public.\"ItineraryStops\" WHERE \"Id\" BETWEEN 1 AND 26;");
            migrationBuilder.Sql("DELETE FROM public.\"Itineraries\" WHERE \"Id\" BETWEEN 1 AND 5;");
        }
    }
}
