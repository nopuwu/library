using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using library.Server;
using Microsoft.AspNetCore.Authorization;
using library.Server.Data;
using library.Server.Models;
using System.Security.Claims;
using library.Server.Mappers;
using library.Server.Dtos.Reservation;

namespace library.Server.Controllers
{
    // Kontroler API do zarządzania rezerwacjami książek.
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Pobiera listę wszystkich rezerwacji.
        // GET: api/Reservations
        [HttpGet]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            return await _context.Reservations.ToListAsync();
        }

        // Pobiera rezerwację o określonym ID.
        // GET: api/Reservations/5
        [HttpGet("{id}")]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            return reservation;
        }

        // Tworzy nową rezerwację.
        // POST: api/Reservations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{bookId:int}")]
        [Authorize]
        public async Task<ActionResult<Reservation>> PostReservation(int bookId)
        {
            var bookCopy = await _context.BookCopies
                .Where(bc => bc.BookId == bookId && bc.Availability == BookCopy.AvailabilityEnum.Dostępna)
                .FirstOrDefaultAsync();

            if (bookCopy == null)
            {
                return BadRequest("Book copy is not available.");
            }

            bookCopy.Availability = BookCopy.AvailabilityEnum.Zarezerwowana;

            var reservation = new Reservation(
                DateTime.Now,
                bookCopy.Id,
                int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier))
            );

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReservation", new { id = reservation.Id }, reservation.MapToDto());
        }

        // Usuwa rezerwację o określonym ID.
        // DELETE: api/Reservations/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            var bookCopy = await _context.BookCopies.FindAsync(reservation.CopyId);
            if (bookCopy != null)
            {
                bookCopy.Availability = BookCopy.AvailabilityEnum.Dostępna;
                _context.Entry(bookCopy).State = EntityState.Modified;
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserReservationDto>>> GetUserReservations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }

            var reservations = await _context.Reservations
                .Where(r => r.UserId == parsedUserId)
                .Include(r => r.Copy)
                .ThenInclude(bc => bc.Book)
                .Select(r => new UserReservationDto
                {
                    Id = r.Id,
                    Title = r.Copy.Book.Title,
                    Author = r.Copy.Book.Author,
                    ReservationDate = r.ReservationDate
                })
                .ToListAsync();

            if (!reservations.Any())
            {
                return null;
            }

            return Ok(reservations);
        }
    }
}
