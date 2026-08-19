using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShopStructuredHours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StructuredHoursJson",
                schema: "public",
                table: "Shops",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StructuredHoursJson",
                schema: "public",
                table: "Shops");
        }
    }
}
