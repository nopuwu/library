using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Models
{
    // Reprezentuje książkę w bibliotece. Książka może mieć wiele fizycznych egzemplarzy (BookCopy).
    public class Book(string title, string author, string genre, string isbn, int copies = 1)
    {
        public int Id { get; set; } // Klucz główny
        public string Title { get; set; } = title;
        public string Author { get; set; } = author;
        public string Genre { get; set; } = genre;
        public int Copies { get; set; } = copies; // Liczba dostępnych kopii
        public string Isbn { get; set; } = isbn;

        // Lista wszystkich egzemplarzy tej książki
        public List<BookCopy> BookCopies { get; } = new();
    }
}