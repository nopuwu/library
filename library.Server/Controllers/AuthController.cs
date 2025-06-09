using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using library.Server.Data;
using Microsoft.EntityFrameworkCore;
using library.Server.Dtos.AccountDto;
using library.Server.Models;
using library.Server.Dtos.Account;

namespace library.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ApplicationDbContext _context;

        public AuthController(AuthService authService, ApplicationDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = await _authService.Authenticate(loginDto.Username, loginDto.Password);

            if (user == null)
                return Unauthorized();

            var token = await _authService.GenerateToken(user);

            return Ok(new NewUserDto {
                Token = token,
                Username = user.Username,
                Email = user.Email
            });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                return Conflict("Username is already taken");
            }

            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return Conflict("Email is already registered");
            }

            var user = new User(model.Username, model.Email);
            user.SetPassword(model.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Registration successful" });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var username = User.FindFirstValue(ClaimTypes.Name);
                var email = User.FindFirstValue(ClaimTypes.Email);
                var roleString = User.FindFirstValue(ClaimTypes.Role);

                // Walidacja danych
                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(roleString))
                {
                    return BadRequest("Invalid user data in token");
                }

                // Konwersja stringa na enum
                if (Enum.TryParse<library.Server.Models.User.RoleEnum>(roleString, out var role))
                {
                    return Ok(new
                    {
                        UserId = userId,
                        Username = username,
                        Email = email,
                        Role = role.ToString()
                    });
                }

                return BadRequest("Invalid role value");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving user data: {ex.Message}");
            }
        }
    }
}