using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShopImportFieldsAndSeedCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RegionId",
                schema: "public",
                table: "Shops",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                schema: "public",
                table: "Shops",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                schema: "public",
                table: "Shops",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserRatingCount",
                schema: "public",
                table: "Shops",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                schema: "public",
                table: "Shops",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                schema: "public",
                table: "Categories",
                columns: new[] { "Id", "IconUrl", "Name" },
                values: new object[,]
                {
                    { 1, "", "Jewelry" },
                    { 2, "", "TraditionalCostume" },
                    { 3, "", "WoodCarving" },
                    { 4, "", "HandmadePaper" },
                    { 5, "", "Iconography" },
                    { 6, "", "ArtGallery" },
                    { 7, "", "CraftWorkshopGeneral" },
                    { 8, "", "SouvenirShop" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                schema: "public",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DropColumn(
                name: "Rating",
                schema: "public",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "UserRatingCount",
                schema: "public",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "Website",
                schema: "public",
                table: "Shops");

            migrationBuilder.AlterColumn<int>(
                name: "RegionId",
                schema: "public",
                table: "Shops",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                schema: "public",
                table: "Shops",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
