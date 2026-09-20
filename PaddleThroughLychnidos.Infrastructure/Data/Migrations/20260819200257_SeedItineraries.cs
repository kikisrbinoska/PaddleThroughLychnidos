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

            // Raw SQL rather than InsertData: ShopId values below only exist
            // on databases where OhridShopsExporter's output has already
            // been imported (see comment above). On a fresh database with no
            // shops yet, skip each stop whose ShopId isn't present instead of
            // failing the whole migration on a FK violation.
            //
            // ShopIds were originally picked from a different export/import
            // run and didn't match production's actual Shop rows (the WHERE
            // EXISTS guard silently dropped all 26 stops there instead of
            // erroring - itineraries showed "0 stops" with no failure
            // anywhere). Re-verified by name against the real Shops table
            // and corrected below; production's stops were fixed to match
            // via a one-off SQL run rather than a migration re-apply, since
            // this migration was already marked applied.
            migrationBuilder.Sql(@"
                INSERT INTO public.""ItineraryStops"" (""Id"", ""ItineraryId"", ""ShopId"", ""Order"", ""Notes"", ""SuggestedTime"")
                SELECT * FROM (VALUES
                    (1, 1, 29, 1, 'Family-run pearl workshop, one of the originators of the Ohrid pearl technique.', INTERVAL '25 minutes'),
                    (2, 1, 59, 2, 'Dr. Pavel Filev''s pearl atelier - ask about the historic hand-stringing method.', INTERVAL '20 minutes'),
                    (3, 1, 60, 3, 'Sister branch of the Filevi pearl house, a few doors down.', INTERVAL '15 minutes'),
                    (4, 1, 63, 4, 'Original Ohrid Pearl Filevi - compare designs across the family''s shops.', INTERVAL '15 minutes'),
                    (5, 1, 72, 5, 'Risteski traditional handmade pearls, known for classic strand necklaces.', INTERVAL '20 minutes'),
                    (6, 1, 81, 6, 'Stars Pearls & Silver to round out the lane before heading back to the square.', INTERVAL '15 minutes'),
                    (7, 2, 10, 1, 'Bellusso Silver & Pearls, right off the main square.', INTERVAL '20 minutes'),
                    (8, 2, 34, 2, 'Gino Silver Ohrid - watch filigree work in progress most mornings.', INTERVAL '20 minutes'),
                    (9, 2, 30, 3, 'FILIP Pearls & Jewellery, a small family counter with custom pieces.', INTERVAL '15 minutes'),
                    (10, 2, 83, 4, 'Talevi Ohrid Pearls, a longstanding lakefront-adjacent shop.', INTERVAL '20 minutes'),
                    (11, 2, 84, 5, 'Tanes Pearls & Jewellery to finish the loop back toward the old town gate.', INTERVAL '15 minutes'),
                    (12, 3, 20, 1, 'Church of Saint Jovan the Theologian at Kaneo - the iconic clifftop lake view.', INTERVAL '30 minutes'),
                    (13, 3, 76, 2, 'Samuel''s Fortress walls, a short climb with panoramic views over Ohrid.', INTERVAL '40 minutes'),
                    (14, 3, 21, 3, 'Church of Saint Sophia, one of the most important Byzantine monuments in the region.', INTERVAL '35 minutes'),
                    (15, 3, 23, 4, 'Church of the Virgin Mary Peribleptos, home to well-preserved medieval frescoes.', INTERVAL '30 minutes'),
                    (16, 3, 22, 5, 'Church of Saints Constantine and Helen to close out the sacred sites loop.', INTERVAL '25 minutes'),
                    (17, 4, 51, 1, 'National Workshop For Handmade Paper - Ljupcho Panevski, papermaking demonstrations.', INTERVAL '30 minutes'),
                    (18, 4, 74, 2, 'Robevci Family House, a restored merchant house showcasing period woodwork.', INTERVAL '35 minutes'),
                    (19, 4, 90, 3, 'Woodcarving Gallery Tron, intricate carved iconostasis panels on display.', INTERVAL '25 minutes'),
                    (20, 4, 38, 4, 'Icon Gallery of Ohrid, traditional egg-tempera icon painting.', INTERVAL '25 minutes'),
                    (21, 4, 7, 5, 'Atelier Anastas Dudan, a working woodcarving studio open to visitors.', INTERVAL '25 minutes'),
                    (22, 5, 53, 1, 'Nomadica by Biljana, contemporary mixed-media pieces inspired by the lake.', INTERVAL '20 minutes'),
                    (23, 5, 33, 2, 'Gallery Marta Pejoska, local landscape painting.', INTERVAL '20 minutes'),
                    (24, 5, 80, 3, 'SRNA, a small curated gallery just off the bazaar.', INTERVAL '15 minutes'),
                    (25, 5, 25, 4, 'Collarette Ohrid, jewelry-adjacent art pieces and accessories.', INTERVAL '15 minutes'),
                    (26, 5, 82, 5, 'Stojan Stojanovski Gallery Shop to end the walk near the bazaar entrance.', INTERVAL '20 minutes')
                ) AS stop(""Id"", ""ItineraryId"", ""ShopId"", ""Order"", ""Notes"", ""SuggestedTime"")
                WHERE EXISTS (SELECT 1 FROM public.""Shops"" s WHERE s.""Id"" = stop.""ShopId"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM public.\"ItineraryStops\" WHERE \"Id\" BETWEEN 1 AND 26;");
            migrationBuilder.Sql("DELETE FROM public.\"Itineraries\" WHERE \"Id\" BETWEEN 1 AND 5;");
        }
    }
}
