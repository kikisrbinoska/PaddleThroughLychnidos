using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PaddleThroughLychnidos.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Password hash below is PasswordHasher.HashPassword("Test123!")
            // (Rfc2898DeriveBytes/PBKDF2-SHA256, 16-byte salt + 20-byte
            // hash, base64) - verified against PasswordHasher.VerifyPassword
            // before being hardcoded here. ON CONFLICT DO NOTHING so this
            // stays a no-op on a database where the account was already
            // created by hand (e.g. via /api/auth/register + a manual role
            // update) rather than through this migration.
            migrationBuilder.Sql(
                "INSERT INTO public.\"Users\" (\"Name\", \"Username\", \"Email\", \"Password\", \"Role\", \"CreatedAt\") " +
                "VALUES ('Kiki Admin', 'kikiadmin', 'kikiadmin@paddlethroughlychnidos.local', " +
                "'xD2TDYff75787TBROIYa9OSOph0ig8dZ6wBpP2qCWpE29u3c', 'Administrator', now()) " +
                "ON CONFLICT (\"Username\") DO NOTHING;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM public.\"Users\" WHERE \"Username\" = 'kikiadmin';");
        }
    }
}
