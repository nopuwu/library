using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using library.Server;
using Microsoft.EntityFrameworkCore;

namespace library.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly LibraryContext _context;

        public AuthController(AuthService authService, LibraryContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var user = _authService.Authenticate(model.Username, model.Password);

            if (user == null)
                return Unauthorized();

            var token = _authService.GenerateToken(user);

            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Username) ||
               string.IsNullOrWhiteSpace(model.Password) ||
               string.IsNullOrWhiteSpace(model.Email))
            {
                return BadRequest("All fields are required");
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
                if (Enum.TryParse<library.Server.User.RoleEnum>(roleString, out var role))
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

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}