using UserAuth.API.DTOs;
using UserAuth.Application.Helpers;
using UserAuth.Application.Interfaces;
using UserAuth.Domain.Entities;
using UserAuth.Domain.Interfaces;

namespace UserAuth.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsers();
            return users.Select(user => new UserDTO
            {
                Name = user.Name,
                Email = user.Email,
                Username = user.Username
            });
        }

        public async Task<UserDTO> GetUserById(int id)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null) return null;

            return new UserDTO
            {
                Name = user.Name,
                Email = user.Email,
                Username = user.Username
            };
        }

        public async Task AddUser(UserDTO userDTO)
        {
            var user = new User
            {
                Name = userDTO.Name,
                Email = userDTO.Email,
                Username = userDTO.Username,
                Password = PasswordHelper.HashPassword(userDTO.Password)
            };

            await _userRepository.AddUser(user);
        }

        public async Task UpdateUser(int id, UserDTO userDTO)
        {
            var user = await _userRepository.GetUserById(id);
            if (user != null)
            {
                user.Name = userDTO.Name;
                user.Email = userDTO.Email;
                user.Username = userDTO.Username;

                await _userRepository.UpdateUser(user);
            }
        }

        public async Task DeleteUser(int id)
        {
            await _userRepository.DeleteUser(id);
        }
    }
}
