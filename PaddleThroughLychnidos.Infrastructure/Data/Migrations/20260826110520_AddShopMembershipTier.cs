using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShopMembershipTier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "MembershipActivatedAt",
                schema: "public",
                table: "Shops",
                type: "timestamp with time zone",
                nullable: true);

            // Existing shops predate the membership simulation - they all
            // start on the Free plan (MembershipActivatedAt stays null,
            // matching a shop that has never selected Premium).
            migrationBuilder.AddColumn<string>(
                name: "MembershipTier",
                schema: "public",
                table: "Shops",
                type: "text",
                nullable: false,
                defaultValue: "Free");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MembershipActivatedAt",
                schema: "public",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "MembershipTier",
                schema: "public",
                table: "Shops");
        }
    }
}
