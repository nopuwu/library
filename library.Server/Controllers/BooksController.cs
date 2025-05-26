using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using library.Server;
using library.Server.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace library.Server.Controllers
{
    /// Kontroler API do zarządzania książkami.
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BooksController(LibraryContext context)
        {
            _context = context;
        }

        // Pobiera listę wszystkich książek.
        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            return await _context.Books.ToListAsync();
        }

        // Pobiera książkę o określonym ID.
        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // Tworzy nową książkę lub dodaje egzemplarz, jeśli książka już istnieje.
        // POST: api/Books
        [HttpPost]
        //[Authorize(Roles = "Admin,Bibliotekarz")]
        public async Task<ActionResult<Book>> CreateBook(BookDto bookDto)
        {
            if (_context.Books.Any(b => b.Isbn == bookDto.Isbn))
            {
                return BadRequest();
            }
            if (_context.Books.Any(b => b.Title == bookDto.Title && b.Author == bookDto.Author && b.Genre == bookDto.Genre && b.Isbn == bookDto.Isbn))
            {
                //int copies = _context.Books.Count(b => b.Title == bookDto.Title && b.Author == bookDto.Author && b.Genre == bookDto.Genre);
                var originalBook = await _context.Books.FirstOrDefaultAsync(b => b.Title == bookDto.Title && b.Author == bookDto.Author && b.Genre == bookDto.Genre);
                ++originalBook.Copies;

                BookCopy bookCopy = new(originalBook.Id);
                _context.Add(bookCopy);

                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                Book book = new(bookDto.Title, bookDto.Author, bookDto.Genre, bookDto.Isbn);
                _context.Add(book);
                await _context.SaveChangesAsync();

                BookCopy bookCopy = new(book.Id);
                _context.Add(bookCopy);
                await _context.SaveChangesAsync();

                return Ok(new BookDto
                {
                    Title = book.Title,
                    Author = book.Author,
                    Genre = book.Genre,
                    Isbn = book.Isbn
                });
            }
        }

        // Aktualizuje dane książki o określonym ID.
        // PUT: api/Books/5
        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin,Bibliotekarz")]
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
        //[Authorize(Roles = "Admin,Bibliotekarz")]
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
