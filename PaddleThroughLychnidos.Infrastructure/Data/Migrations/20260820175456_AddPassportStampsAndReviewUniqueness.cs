using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPassportStampsAndReviewUniqueness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId",
                schema: "public",
                table: "Reviews");

            migrationBuilder.CreateTable(
                name: "PassportStamps",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ShopId = table.Column<int>(type: "integer", nullable: false),
                    VisitedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PassportStamps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PassportStamps_Shops_ShopId",
                        column: x => x.ShopId,
                        principalSchema: "public",
                        principalTable: "Shops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PassportStamps_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId_ShopId",
                schema: "public",
                table: "Reviews",
                columns: new[] { "UserId", "ShopId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PassportStamps_ShopId",
                schema: "public",
                table: "PassportStamps",
                column: "ShopId");

            migrationBuilder.CreateIndex(
                name: "IX_PassportStamps_UserId_ShopId",
                schema: "public",
                table: "PassportStamps",
                columns: new[] { "UserId", "ShopId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PassportStamps",
                schema: "public");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId_ShopId",
                schema: "public",
                table: "Reviews");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                schema: "public",
                table: "Reviews",
                column: "UserId");
        }
    }
}
