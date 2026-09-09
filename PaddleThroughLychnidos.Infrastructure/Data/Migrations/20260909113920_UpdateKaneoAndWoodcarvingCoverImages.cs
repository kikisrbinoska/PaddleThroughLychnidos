using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateKaneoAndWoodcarvingCoverImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Itineraries",
                keyColumn: "Id",
                keyValue: 3,
                column: "CoverImageUrl",
                value: "/src/assets/itineraries/kaneo-route-cover.jpg");

            migrationBuilder.UpdateData(
                table: "Itineraries",
                keyColumn: "Id",
                keyValue: 4,
                column: "CoverImageUrl",
                value: "/src/assets/itineraries/woodcarving-route-cover.jpg");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Itineraries",
                keyColumn: "Id",
                keyValue: 3,
                column: "CoverImageUrl",
                value: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800");

            migrationBuilder.UpdateData(
                table: "Itineraries",
                keyColumn: "Id",
                keyValue: 4,
                column: "CoverImageUrl",
                value: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800");
        }
    }
}
