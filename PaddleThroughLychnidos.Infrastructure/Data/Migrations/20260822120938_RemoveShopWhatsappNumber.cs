using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveShopWhatsappNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WhatsappNumber",
                schema: "public",
                table: "Shops");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WhatsappNumber",
                schema: "public",
                table: "Shops",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
