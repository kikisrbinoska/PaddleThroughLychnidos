using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedRegions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // A placeholder row (Id=1, Name="regio", Description="string")
            // already exists from manual Swagger testing, and Shop rows
            // reference RegionId=1 via a Restrict FK - it can't be deleted
            // and reinserted. Overwrite it in place with the real Varosh
            // data instead, so existing shop-region links stay intact.
            migrationBuilder.Sql(
                "UPDATE public.\"Regions\" " +
                "SET \"Name\" = 'Varosh - Old Town of Ohrid - 6000 Ohrid, North Macedonia', " +
                "\"Description\" = '', " +
                "\"PolygonGeoJson\" = '{\"type\":\"Polygon\",\"coordinates\":[[[20.787599,41.114936],[20.788264,41.109979],[20.799301,41.111026],[20.800473,41.113924],[20.794001,41.116244],[20.789311,41.115731],[20.787599,41.114936]]]}' " +
                "WHERE \"Id\" = 1;");

            migrationBuilder.InsertData(
                schema: "public",
                table: "Regions",
                columns: new[] { "Id", "Description", "Name", "PolygonGeoJson" },
                values: new object[,]
                {
                    { 2, "", "Old Bazaar (Čaršija) - 6000 Ohrid, North Macedonia", "{\"type\":\"Polygon\",\"coordinates\":[[[20.799199,41.112732],[20.800338,41.113574],[20.800338,41.113574],[20.802225,41.116929],[20.79801,41.116943],[20.799199,41.112732]]]}" },
                    { 3, "", "Plaošnik / Kaneo - 6000 Ohrid, North Macedonia", "{\"type\":\"Polygon\",\"coordinates\":[[[20.791895,41.113603],[20.788127,41.113732],[20.78826,41.110899],[20.792445,41.11051],[20.792447,41.11052],[20.791895,41.113603]]]}" },
                    { 4, "", "St. Naum Monastery - Ohrid Lake, North Macedonia", "{\"type\":\"Polygon\",\"coordinates\":[[[20.732367,40.91161],[20.746379,40.908202],[20.74673,40.907989],[20.746769,40.907947],[20.760209,40.914992],[20.760223,40.914952],[20.745256,40.915788],[20.745323,40.915754],[20.732339,40.91165],[20.732367,40.91161]]]}" },
                    { 5, "", "Bay of Bones (Museum on Water) - Ohrid Lake, North Macedonia", "{\"type\":\"Polygon\",\"coordinates\":[[[20.800361,40.993928],[20.801592,40.996752],[20.801571,40.996706],[20.801584,40.996697],[20.796341,40.996917],[20.796344,40.996909],[20.796153,40.993998],[20.796163,40.99399],[20.800359,40.993935],[20.800361,40.993928]]]}" },
                    { 6, "", "Ohrid Lakefront Promenade - 6000 Ohrid, North Macedonia", "{\"type\":\"Polygon\",\"coordinates\":[[[20.735171,40.914576],[20.777828,40.912398],[20.777252,40.911744],[20.777375,40.911598],[20.84729,41.030999],[20.847329,41.030958],[20.802615,41.106184],[20.80274,41.105997],[20.735171,40.914576]]]}" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE public.\"Regions\" " +
                "SET \"Name\" = 'regio', \"Description\" = 'string', \"PolygonGeoJson\" = 'string' " +
                "WHERE \"Id\" = 1;");

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Regions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Regions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Regions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Regions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Regions",
                keyColumn: "Id",
                keyValue: 6);
        }
    }
}
