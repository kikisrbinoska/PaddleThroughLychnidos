using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLearnVideos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LearnVideos",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    YoutubeVideoId = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "text", nullable: false),
                    ChannelName = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    RelatedCategoryId = table.Column<int>(type: "integer", nullable: true),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FetchedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearnVideos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LearnVideos_Categories_RelatedCategoryId",
                        column: x => x.RelatedCategoryId,
                        principalSchema: "public",
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LearnVideos_Category",
                schema: "public",
                table: "LearnVideos",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_LearnVideos_RelatedCategoryId",
                schema: "public",
                table: "LearnVideos",
                column: "RelatedCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_LearnVideos_YoutubeVideoId",
                schema: "public",
                table: "LearnVideos",
                column: "YoutubeVideoId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LearnVideos",
                schema: "public");
        }
    }
}
