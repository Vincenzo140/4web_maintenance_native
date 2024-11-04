using Microsoft.AspNetCore.Mvc;
using UserAuth.Domain.Entities;

namespace UserAuth.Application.Interfaces
{
    public interface ITokenService
    {
        public string GenerateToken(User user);

        public string RefreshToken();
    }
}
