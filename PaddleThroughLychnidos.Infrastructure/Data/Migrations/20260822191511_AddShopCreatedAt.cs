using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShopCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Existing shops predate this column - their real creation date
            // isn't recoverable, so backfill to "now" (this migration's
            // apply time) rather than the C# DateTime default (0001-01-01),
            // which would render as a nonsensical "submitted date" in the
            // admin Pending Shops screen.
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "public",
                table: "Shops",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "public",
                table: "Shops");
        }
    }
}
