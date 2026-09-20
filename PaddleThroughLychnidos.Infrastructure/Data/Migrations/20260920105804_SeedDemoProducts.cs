using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDemoProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Demo catalog for search/marketplace testing. ShopIds below were
            // looked up by category directly against the Shops table (Aurea
            // Pearls & Silver / Jewelry, Book store Eoni 9 / HandmadePaper,
            // Ethno Shop / WoodCarving) rather than reused from
            // SeedItineraries's comments, since those ShopId references
            // don't line up with every database's import order.
            // Id is left to the identity column rather than set explicitly,
            // since SeedItineraries's explicit-Id inserts never advanced
            // their table's sequence and this avoids repeating that.
            migrationBuilder.Sql(@"
                INSERT INTO public.""Products"" (""ShopId"", ""Name"", ""Description"", ""Price"", ""ImageUrl"")
                SELECT * FROM (VALUES
                    (9, 'Hand-Strung Pearl Necklace', 'Classic single-strand Ohrid pearl necklace, hand-strung using the family''s traditional technique.', 45.00::numeric, ''),
                    (9, 'Pearl Drop Earrings', 'Freshwater Ohrid pearl drop earrings with a silver hook.', 22.00::numeric, ''),
                    (13, 'Handmade Paper Notebook', 'A6 notebook bound with sheets of handmade paper pressed at the workshop.', 12.50::numeric, ''),
                    (13, 'Pressed Flower Paper Sheet Set', 'Set of 5 decorative handmade paper sheets, each pressed with dried lake-region flowers.', 9.00::numeric, ''),
                    (27, 'Carved Wooden Icon Panel', 'Small hand-carved wooden panel in the traditional Ohrid iconography style.', 60.00::numeric, ''),
                    (27, 'Walnut Wood Jewelry Box', 'Hand-carved walnut wood jewelry box with a fitted lid.', 38.00::numeric, '')
                ) AS demo_products(""ShopId"", ""Name"", ""Description"", ""Price"", ""ImageUrl"")
                WHERE EXISTS (SELECT 1 FROM public.""Shops"" WHERE ""Id"" = demo_products.""ShopId"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM public.""Products""
                WHERE ""ShopId"" IN (9, 13, 27)
                AND ""Name"" IN (
                    'Hand-Strung Pearl Necklace',
                    'Pearl Drop Earrings',
                    'Handmade Paper Notebook',
                    'Pressed Flower Paper Sheet Set',
                    'Carved Wooden Icon Panel',
                    'Walnut Wood Jewelry Box'
                );
            ");
        }
    }
}
