namespace PaddleThroughLychnidos.Application.Abstractions
{
    public interface IAuthService
    {
        string GenerateToken(int userId, string username, string role);
    }
}
