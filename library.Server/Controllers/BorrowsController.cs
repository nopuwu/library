using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using library.Server;

namespace library.Server.Controllers
{
    // Kontroler API do zarządzania wypożyczeniami książek.
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowsController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BorrowsController(LibraryContext context)
        {
            _context = context;
        }

        // Pobiera listę wszystkich wypożyczeń książek.
        // GET: api/Borrows
        [HttpGet]
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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBorrow(int id, Borrow borrow)
        {
            if (id != borrow.Id)
            {
                return BadRequest();
            }

            _context.Entry(borrow).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BorrowExists(id))
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

        // Tworzy wypożyczenie książki.
        // POST: api/Borrows
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Borrow>> PostBorrow(Borrow borrow)
        {
            _context.Borrowings.Add(borrow);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBorrow", new { id = borrow.Id }, borrow);
        }

        // Usuwa wypożyczenie książki o określonym ID.
        // DELETE: api/Borrows/5
        [HttpDelete("{id}")]
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

        // Sprawdza, czy wypożyczenie książki o określonym ID istnieje.
        private bool BorrowExists(int id)
        {
            return _context.Borrowings.Any(e => e.Id == id);
        }
    }
}
