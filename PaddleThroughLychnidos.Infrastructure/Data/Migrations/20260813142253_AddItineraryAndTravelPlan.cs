using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddItineraryAndTravelPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Itineraries",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CoverImageUrl = table.Column<string>(type: "text", nullable: false),
                    DurationHours = table.Column<int>(type: "integer", nullable: false),
                    RegionId = table.Column<int>(type: "integer", nullable: false),
                    Difficulty = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Itineraries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Itineraries_Regions_RegionId",
                        column: x => x.RegionId,
                        principalSchema: "public",
                        principalTable: "Regions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItineraryStops",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ItineraryId = table.Column<int>(type: "integer", nullable: false),
                    ShopId = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    SuggestedTime = table.Column<TimeSpan>(type: "interval", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItineraryStops", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItineraryStops_Itineraries_ItineraryId",
                        column: x => x.ItineraryId,
                        principalSchema: "public",
                        principalTable: "Itineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItineraryStops_Shops_ShopId",
                        column: x => x.ShopId,
                        principalSchema: "public",
                        principalTable: "Shops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TravelPlanItems",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ShopId = table.Column<int>(type: "integer", nullable: true),
                    ItineraryId = table.Column<int>(type: "integer", nullable: true),
                    AddedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TravelPlanItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TravelPlanItems_Itineraries_ItineraryId",
                        column: x => x.ItineraryId,
                        principalSchema: "public",
                        principalTable: "Itineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TravelPlanItems_Shops_ShopId",
                        column: x => x.ShopId,
                        principalSchema: "public",
                        principalTable: "Shops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TravelPlanItems_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Itineraries_RegionId",
                schema: "public",
                table: "Itineraries",
                column: "RegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ItineraryStops_ItineraryId",
                schema: "public",
                table: "ItineraryStops",
                column: "ItineraryId");

            migrationBuilder.CreateIndex(
                name: "IX_ItineraryStops_ItineraryId_Order",
                schema: "public",
                table: "ItineraryStops",
                columns: new[] { "ItineraryId", "Order" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItineraryStops_ShopId",
                schema: "public",
                table: "ItineraryStops",
                column: "ShopId");

            migrationBuilder.CreateIndex(
                name: "IX_TravelPlanItems_ItineraryId",
                schema: "public",
                table: "TravelPlanItems",
                column: "ItineraryId");

            migrationBuilder.CreateIndex(
                name: "IX_TravelPlanItems_ShopId",
                schema: "public",
                table: "TravelPlanItems",
                column: "ShopId");

            migrationBuilder.CreateIndex(
                name: "IX_TravelPlanItems_UserId",
                schema: "public",
                table: "TravelPlanItems",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItineraryStops",
                schema: "public");

            migrationBuilder.DropTable(
                name: "TravelPlanItems",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Itineraries",
                schema: "public");
        }
    }
}
