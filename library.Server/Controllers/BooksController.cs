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
using library.Server.Models;
using library.Server.Dtos.Book;

namespace library.Server.Controllers
{
    /// Kontroler API do zarządzania książkami.
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Pobiera listę wszystkich książek.
        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _context.Books.Include(c => c.BookCopies).ToListAsync();
            return Ok(books);
        }

        // Pobiera książkę o określonym ID.
        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.Include(c => c.BookCopies).FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // Tworzy nową książkę lub dodaje egzemplarz, jeśli książka już istnieje.
        // POST: api/Books
        [HttpPost]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<ActionResult<BookDto>> CreateBook([FromBody] CreateBookRequest bookRequest)
        {
            if (bookRequest.CopyCount <= 0)
            {
                return BadRequest("Number of copies must be greater than zero.");
            }
            var existingBook = await _context.Books
                .FirstOrDefaultAsync(b => b.Title == bookRequest.Book.Title && b.Author == bookRequest.Book.Author && b.Isbn == bookRequest.Book.Isbn);
            if (existingBook != null)
            {
                // Jeśli książka już istnieje, dodaj nowy egzemplarz.
                for (int i = 0; i < bookRequest.CopyCount; i++)
                {
                    BookCopy bookCopy = new BookCopy(existingBook.Id, BookCopy.AvailabilityEnum.Dostępna);
                    _context.BookCopies.Add(bookCopy);
                }
                existingBook.Copies += bookRequest.CopyCount; // Aktualizuj liczbę egzemplarzy
                await _context.SaveChangesAsync();
                return Ok(new BookDto
                {
                    Title = existingBook.Title,
                    Author = existingBook.Author,
                    Genre = existingBook.Genre,
                    Isbn = existingBook.Isbn,
                });
            }
            else
            {
                // Jeśli książka nie istnieje, utwórz nową książkę i dodaj egzemplarze.
                Book newBook = new Book(
                    bookRequest.Book.Title,
                    bookRequest.Book.Author,
                    bookRequest.Book.Genre,
                    bookRequest.Book.Isbn,
                    bookRequest.CopyCount // Ustaw liczbę egzemplarzy
                );
                _context.Books.Add(newBook);
                await _context.SaveChangesAsync();

                for (int i = 0; i < bookRequest.CopyCount; i++)
                {
                    var newCopy = new BookCopy(newBook.Id, BookCopy.AvailabilityEnum.Dostępna);
                    _context.BookCopies.Add(newCopy);
                }

                await _context.SaveChangesAsync();
                return Ok(new BookDto
                {
                    Title = newBook.Title,
                    Author = newBook.Author,
                    Genre = newBook.Genre,
                    Isbn = newBook.Isbn,
                });
            }
        }

        // Aktualizuje dane książki o określonym ID.
        // PUT: api/Books/5
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<IActionResult> UpdateBook(int id, BookDto updatedBook)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.Genre = updatedBook.Genre;
            book.Isbn = updatedBook.Isbn;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Usuwa książkę o określonym ID.
        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminOrLibrarian")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Sprawdza, czy książka o danym ID istnieje.
        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}
