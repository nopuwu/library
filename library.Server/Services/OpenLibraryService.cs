using System.Text.Json;
using System.Text.Json.Serialization;
using library.Server.Models;

public interface IOpenLibraryService
{
    Task<IEnumerable<BookOpenLibrary>> GetBooksByTitleAsync(string title, int limit = 10);
}

public class OpenLibraryService : IOpenLibraryService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenLibraryService> _logger;
    private const string BASE_URL = "https://openlibrary.org/";

    public OpenLibraryService(HttpClient httpClient, ILogger<OpenLibraryService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        
        // Set base address if not already set
        if (_httpClient.BaseAddress == null)
        {
            _httpClient.BaseAddress = new Uri(BASE_URL);
        }
    }

    public async Task<IEnumerable<BookOpenLibrary>> GetBooksByTitleAsync(string title, int limit = 10)
    {
        try
        {
            // Use the correct search endpoint
            var response = await _httpClient.GetAsync(
                $"search.json?title={Uri.EscapeDataString(title)}&limit={limit}"
            );
            response.EnsureSuccessStatusCode();
           
            var content = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("Search response: {Content}", content); // Add logging to debug
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            
            var result = JsonSerializer.Deserialize<OpenLibrarySearchResult>(content, options);
           
            if (result?.Docs == null || !result.Docs.Any())
            {
                _logger.LogWarning("No books found for title: {Title}", title);
                return Enumerable.Empty<BookOpenLibrary>();
            }

            var books = new List<BookOpenLibrary>();
            
            foreach (var doc in result.Docs)
            {
                var book = new BookOpenLibrary
                {
                    Title = doc.Title,
                    Authors = doc.AuthorName?.Select(name => new AuthorOpenLibrary { Name = name }).ToArray(),
                    PublishDate = doc.FirstPublishYear?.ToString(),
                    Isbn = doc.Isbn?.FirstOrDefault(), // This should work if ISBN is in search results
                    Genre = GetGenreFromDoc(doc) // Enhanced genre extraction
                };

                _logger.LogDebug("Book: {Title}, ISBN from search: {Isbn}, Genre: {Genre}", 
                    book.Title, book.Isbn, book.Genre);

                // If no ISBN found in search results, try to get it from editions
                if (string.IsNullOrEmpty(book.Isbn) && !string.IsNullOrEmpty(doc.Key))
                {
                    try
                    {
                        // Fix the editions URL - remove leading slash from doc.Key if present
                        var workKey = doc.Key.TrimStart('/');
                        var editionsUrl = $"{workKey}/editions.json?limit=5"; // Get more editions to increase chances
                        
                        _logger.LogDebug("Fetching editions from: {Url}", editionsUrl);
                        
                        var editionsResponse = await _httpClient.GetAsync(editionsUrl);
                        if (editionsResponse.IsSuccessStatusCode)
                        {
                            var editionsContent = await editionsResponse.Content.ReadAsStringAsync();
                            var editions = JsonSerializer.Deserialize<OpenLibraryEditionsResult>(editionsContent, options);
                            
                            // Try to find ISBN from any edition
                            foreach (var edition in editions?.Entries ?? new List<OpenLibraryEdition>())
                            {
                                if (edition.Isbn13?.Any() == true)
                                {
                                    book.Isbn = edition.Isbn13.First();
                                    break;
                                }
                                else if (edition.Isbn10?.Any() == true)
                                {
                                    book.Isbn = edition.Isbn10.First();
                                    break;
                                }
                            }
                            
                            _logger.LogDebug("ISBN from editions: {Isbn}", book.Isbn);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to fetch editions for work: {WorkKey}", doc.Key);
                    }
                }

                books.Add(book);
            }

            return books;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching books by title: {Title}", title);
            return Enumerable.Empty<BookOpenLibrary>();
        }
    }

    private string? GetGenreFromDoc(OpenLibraryBookDoc doc)
    {
        // Try multiple sources for genre information
        var genreSources = new List<List<string>?>
        {
            doc.Subject,
            doc.SubjectFacet,
            doc.Genre
        };

        foreach (var source in genreSources)
        {
            if (source?.Any() == true)
            {
                // Filter for more recognizable genres
                var genre = source.FirstOrDefault(s => IsRecognizableGenre(s.ToLower()));
                if (!string.IsNullOrEmpty(genre))
                {
                    return CleanGenreName(genre);
                }
            }
        }

        // If no recognizable genre found, return the first subject
        return doc.Subject?.FirstOrDefault() ?? 
               doc.SubjectFacet?.FirstOrDefault() ?? 
               doc.Genre?.FirstOrDefault();
    }

    private bool IsRecognizableGenre(string subject)
    {
        var commonGenres = new[]
        {
            "fiction", "fantasy", "science fiction", "mystery", "romance", "thriller",
            "horror", "adventure", "drama", "comedy", "biography", "autobiography",
            "history", "science", "philosophy", "religion", "self-help", "cookbook",
            "travel", "poetry", "children", "young adult", "crime", "detective",
            "literary fiction", "historical fiction", "contemporary fiction"
        };

        return commonGenres.Any(genre => subject.Contains(genre));
    }

    private string CleanGenreName(string genre)
    {
        // Clean up genre names (remove extra words, capitalize properly)
        return genre.Replace("fiction", "Fiction")
                   .Replace("science fiction", "Science Fiction")
                   .Replace("young adult", "Young Adult")
                   .Trim();
    }
}

// Model classes
public class OpenLibrarySearchResult
{
    [JsonPropertyName("docs")]
    public List<OpenLibraryBookDoc>? Docs { get; set; }
}

public class OpenLibraryBookDoc
{
    [JsonPropertyName("key")]
    public string? Key { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }
   
    [JsonPropertyName("author_name")]
    public List<string>? AuthorName { get; set; }
   
    [JsonPropertyName("first_publish_year")]
    public int? FirstPublishYear { get; set; }
   
    [JsonPropertyName("isbn")]
    public List<string>? Isbn { get; set; }

    [JsonPropertyName("subject")]
    public List<string>? Subject { get; set; }

    // Additional fields that might contain genre information
    [JsonPropertyName("subject_facet")]
    public List<string>? SubjectFacet { get; set; }

    [JsonPropertyName("subject_key")]
    public List<string>? SubjectKey { get; set; }

    [JsonPropertyName("genre")]
    public List<string>? Genre { get; set; }

    [JsonPropertyName("ddc")]
    public List<string>? DeweyDecimal { get; set; }

    [JsonPropertyName("lcc")]
    public List<string>? LibraryOfCongress { get; set; }
}

public class OpenLibraryEditionsResult
{
    [JsonPropertyName("entries")]
    public List<OpenLibraryEdition>? Entries { get; set; }
}

public class OpenLibraryEdition
{
    [JsonPropertyName("isbn_10")]
    public List<string>? Isbn10 { get; set; }

    [JsonPropertyName("isbn_13")]
    public List<string>? Isbn13 { get; set; }
}