using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShopApprovalAndVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                schema: "public",
                table: "Shops",
                type: "text",
                nullable: true);

            // Backfills every existing shop (all from the Google Places
            // bulk import, already live in the app) to Approved - matches
            // ShopStatus.Approved's string representation via
            // HasConversion<string>(). New artisan-created shops
            // explicitly set Status = Pending in Shop.Commands.AddHandler,
            // overriding this default.
            migrationBuilder.AddColumn<string>(
                name: "Status",
                schema: "public",
                table: "Shops",
                type: "text",
                nullable: false,
                defaultValue: "Approved");

            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                schema: "public",
                table: "Shops",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "VerificationRequests",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ShopId = table.Column<int>(type: "integer", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    DocumentUrlsJson = table.Column<string>(type: "text", nullable: false),
                    ReviewedByAdminId = table.Column<int>(type: "integer", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RejectionReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerificationRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VerificationRequests_Shops_ShopId",
                        column: x => x.ShopId,
                        principalSchema: "public",
                        principalTable: "Shops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VerificationRequests_Users_ReviewedByAdminId",
                        column: x => x.ReviewedByAdminId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Shops_Status",
                schema: "public",
                table: "Shops",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_VerificationRequests_ReviewedByAdminId",
                schema: "public",
                table: "VerificationRequests",
                column: "ReviewedByAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_VerificationRequests_ShopId",
                schema: "public",
                table: "VerificationRequests",
                column: "ShopId");

            migrationBuilder.CreateIndex(
                name: "IX_VerificationRequests_Status",
                schema: "public",
                table: "VerificationRequests",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VerificationRequests",
                schema: "public");

            migrationBuilder.DropIndex(
                name: "IX_Shops_Status",
                schema: "public",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                schema: "public",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "Status",
                schema: "public",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                schema: "public",
                table: "Shops");
        }
    }
}
