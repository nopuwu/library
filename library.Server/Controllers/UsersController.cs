using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using library.Server.Data;
using library.Server.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using library.Server.Models;
using library.Server.Dtos.Account;

namespace library.Server.Controllers
{
    // Kontroler API do zarządzania użytkownikami.
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(UserManager<IdentityUser> userManager, ApplicationDbContext context)
        {
            _context = context;
        }

        // Pobiera listę wszystkich użytkowników.
        // Dostępne tylko dla ról: Admin, Bibliotekarz.
        // GET: api/Users
        [HttpGet]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.Include(b => b.Borrowings.Where(b => b.Status == 0)).Include(r => r.Reservations).ToListAsync();
        }

        // Pobiera użytkownika o określonym ID.
        // Dostępne tylko dla ról: Admin, Bibliotekarz.
        // GET: api/Users/5
        [HttpGet("{id}")]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(b => b.Borrowings.Where(b => b.Status == 0)) 
                .Include(r => r.Reservations)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // Aktualizuje dane użytkownika o określonym ID.
        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<IActionResult> PutUser(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Aktualizacja pól użytkownika na podstawie DTO
            user.Username = updateUserDto.username;
            user.Email = updateUserDto.email;

            // Sprawdzenie, czy ID w URL zgadza się z ID użytkownika
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Usuwa użytkownika o określonym ID.
        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [Authorize(Policy= "RequireAdminOrLibrarian")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Sprawdza, czy użytkownik o danym ID istnieje.
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
