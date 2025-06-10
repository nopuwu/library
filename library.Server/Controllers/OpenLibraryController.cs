using library.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IOpenLibraryService _openLibraryService;
        private readonly ILogger<BooksController> _logger;

        public BooksController(IOpenLibraryService openLibraryService, ILogger<BooksController> logger)
        {
            _openLibraryService = openLibraryService;
            _logger = logger;
        }

        [HttpGet("by-title/{title}")]
        [ProducesResponseType(typeof(IEnumerable<BookOpenLibrary>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetBooksByTitle(string title, [FromQuery] int limit = 10)
        {
            try
            {
                var books = await _openLibraryService.GetBooksByTitleAsync(title, limit);

                if (books == null || !books.Any())
                {
                    _logger.LogWarning("No books found with title containing: {Title}", title);
                    return NotFound();
                }

                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books with title: {Title}", title);
                return StatusCode(
                    StatusCodes.Status500InternalServerError, 
                    "An error occurred while processing your request."
                );
            }
        }
    }