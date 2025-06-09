
/// Reprezentuje dane transferowe (DTO) dla książki.
/// Używane do przesyłania danych między klientem a serwerem.
namespace library.Server.Dtos
{
    public class BookDto
    {
        public required string Title { get; set; }
        public required string Author { get; set; }
        public required string Genre { get; set; }
        public required string Isbn { get; set; }
    }
}