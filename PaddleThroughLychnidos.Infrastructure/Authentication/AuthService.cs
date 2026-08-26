using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PaddleThroughLychnidos.Application.Abstractions;

namespace PaddleThroughLychnidos.Infrastructure.Authentication
{
    internal class AuthService(IOptions<JwtSettings> jwtOptions) : IAuthService
    {
        private readonly JwtSettings _jwtSettings = jwtOptions.Value;

        public string GenerateToken(int userId, string username, string role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                // Claim(ClaimTypes.Role, ...) would write the long
                // "http://schemas.../role" URI into the actual JWT payload
                // (JwtSecurityTokenHandler only remaps short<->long claim
                // names for its own outbound/inbound handling, not when
                // writing the raw token). ASP.NET Core's JWT bearer
                // validation still maps this short "role" claim back to
                // ClaimTypes.Role on the way in, so [Authorize(Roles = ...)]
                // is unaffected - but the frontend decodes the raw payload
                // with jwt-decode and needs the short claim name to read
                // decoded.role after a page refresh.
                new Claim("role", role),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
