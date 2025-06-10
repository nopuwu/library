using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Models
{
    public class BookOpenLibrary
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public AuthorOpenLibrary[]? Authors { get; set; }
        public string? PublishDate { get; set; }
        public int? NumberOfPages { get; set; }
        public Dictionary<string, string[]>? Identifiers { get; set; }
        public string? Isbn { get; set; }
        public string? Genre { get; set; }

        // Constructor
        public BookOpenLibrary() { }

        public BookOpenLibrary(string id, string title, AuthorOpenLibrary[] authors, string isbn, string genre)
        {
            Id = id;
            Title = title;
            Authors = authors;
            Isbn = isbn;
            Genre = genre;
        }
    }
}