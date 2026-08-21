using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDayPlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DayPlans",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayPlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DayPlans_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DayPlanStops",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DayPlanId = table.Column<int>(type: "integer", nullable: false),
                    ShopId = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayPlanStops", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DayPlanStops_DayPlans_DayPlanId",
                        column: x => x.DayPlanId,
                        principalSchema: "public",
                        principalTable: "DayPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DayPlanStops_Shops_ShopId",
                        column: x => x.ShopId,
                        principalSchema: "public",
                        principalTable: "Shops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DayPlans_UserId",
                schema: "public",
                table: "DayPlans",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DayPlanStops_DayPlanId",
                schema: "public",
                table: "DayPlanStops",
                column: "DayPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_DayPlanStops_DayPlanId_Order",
                schema: "public",
                table: "DayPlanStops",
                columns: new[] { "DayPlanId", "Order" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DayPlanStops_ShopId",
                schema: "public",
                table: "DayPlanStops",
                column: "ShopId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DayPlanStops",
                schema: "public");

            migrationBuilder.DropTable(
                name: "DayPlans",
                schema: "public");
        }
    }
}
