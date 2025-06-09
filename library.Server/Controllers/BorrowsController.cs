using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using library.Server.Data;
using Microsoft.AspNetCore.Authorization;
using library.Server.Models;
using Microsoft.AspNetCore.Identity;
using library.Server.Dtos.Borrow;
using library.Server.Mappers;
using System.Security.Claims;

namespace library.Server.Controllers
{
    // Kontroler API do zarządzania wypożyczeniami książek.
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BorrowsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Pobiera listę wszystkich wypożyczeń książek.
        // GET: api/Borrows
        [HttpGet]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<ActionResult<IEnumerable<Borrow>>> GetBorrowings()
        {
            return await _context.Borrowings.ToListAsync();
        }

        // Pobiera wypożyczenie książki o określonym ID.
        // GET: api/Borrows/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Borrow>> GetBorrow(int id)
        {
            var borrow = await _context.Borrowings.FindAsync(id);

            if (borrow == null)
            {
                return NotFound();
            }

            return borrow;
        }

        // Aktualizuje dane wypożyczenia książki o określonym ID.
        // PUT: api/Borrows/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("return/{id}")]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<IActionResult> ReturnBook(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var borrow = await _context.Borrowings.FindAsync(id);
            var bookCopy = await _context.BookCopies.FindAsync(borrow.CopyId);
            if (borrow == null)
            {
                return NotFound();
            }

            borrow.Status = Borrow.BorrowingStatusEnum.Zwrócona;
            borrow.ReturnDate = DateTime.Now;
            _context.Entry(borrow).State = EntityState.Modified;

            bookCopy.Availability = BookCopy.AvailabilityEnum.Dostępna;
            _context.Entry(bookCopy).State = EntityState.Modified;


            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Tworzy wypożyczenie książki.
        // POST: api/Borrows
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{bookId:int}")]
        [Authorize]
        public async Task<IActionResult> PostBorrow(int bookId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Nieprawidłowy identyfikator użytkownika.");
            }

            var bookCopy = await _context.BookCopies.FirstOrDefaultAsync(b => b.BookId == bookId && b.Availability == BookCopy.AvailabilityEnum.Dostępna);
            if (bookCopy == null || bookCopy.Availability != BookCopy.AvailabilityEnum.Dostępna)
            {
                return BadRequest("Egzemplarz książki nie jest dostępny do wypożyczenia.");
            }

            var borrow = new Borrow(DateTime.Now, DateTime.Now.AddDays(14), Borrow.BorrowingStatusEnum.Wypożyczona, bookCopy.Id, parsedUserId);
            _context.Borrowings.Add(borrow);

            // Aktualizacja statusu kopii książki
            bookCopy.Availability = BookCopy.AvailabilityEnum.Wypożyczona;
            _context.Entry(bookCopy).State = EntityState.Modified;

            await _context.SaveChangesAsync();


            return CreatedAtAction("GetBorrow", new { id = borrow.Id }, borrow.MapToDto());
        }

        // Usuwa wypożyczenie książki o określonym ID.
        // DELETE: api/Borrows/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBorrow(int id)
        {
            var borrow = await _context.Borrowings.FindAsync(id);
            if (borrow == null)
            {
                return NotFound();
            }

            _context.Borrowings.Remove(borrow);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Borrow>>> GetUserBorrows()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Nieprawidłowy identyfikator użytkownika.");
            }
            var borrows = await _context.Borrowings
                .Where(b => b.UserId == parsedUserId)
                .ToListAsync();

            if (borrows == null || !borrows.Any())
            {
                return NotFound();
            }

            return borrows;
        }
    }
}
