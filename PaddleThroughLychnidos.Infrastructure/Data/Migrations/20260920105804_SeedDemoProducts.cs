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
            // Demo catalog for search/marketplace testing. ShopIds below are
            // the same imported OhridShopsExporter shops referenced by
            // SeedItineraries (pearl workshop, handmade paper workshop,
            // woodcarving gallery) - picked because they already have real
            // names/categories on any database where that migration ran.
            // Id is left to the identity column rather than set explicitly,
            // since SeedItineraries's explicit-Id inserts never advanced
            // their table's sequence and this avoids repeating that.
            migrationBuilder.Sql(@"
                INSERT INTO public.""Products"" (""ShopId"", ""Name"", ""Description"", ""Price"", ""ImageUrl"")
                SELECT * FROM (VALUES
                    (26, 'Hand-Strung Pearl Necklace', 'Classic single-strand Ohrid pearl necklace, hand-strung using the family''s traditional technique.', 45.00::numeric, ''),
                    (26, 'Pearl Drop Earrings', 'Freshwater Ohrid pearl drop earrings with a silver hook.', 22.00::numeric, ''),
                    (45, 'Handmade Paper Notebook', 'A6 notebook bound with sheets of handmade paper pressed at the workshop.', 12.50::numeric, ''),
                    (45, 'Pressed Flower Paper Sheet Set', 'Set of 5 decorative handmade paper sheets, each pressed with dried lake-region flowers.', 9.00::numeric, ''),
                    (79, 'Carved Wooden Icon Panel', 'Small hand-carved wooden panel in the traditional Ohrid iconography style.', 60.00::numeric, ''),
                    (79, 'Walnut Wood Jewelry Box', 'Hand-carved walnut wood jewelry box with a fitted lid.', 38.00::numeric, '')
                ) AS demo_products(""ShopId"", ""Name"", ""Description"", ""Price"", ""ImageUrl"")
                WHERE EXISTS (SELECT 1 FROM public.""Shops"" WHERE ""Id"" = demo_products.""ShopId"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM public.""Products""
                WHERE ""ShopId"" IN (26, 45, 79)
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
