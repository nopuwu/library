using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Models
{
    // Reprezentuje fizyczny egzemplarz książki — może być wypożyczony, dostępny, zarezerwowany lub wycofany.
    public class BookCopy(int bookId, BookCopy.AvailabilityEnum availability = 0)
    {
        public enum AvailabilityEnum
        {
            Dostępna = 0,
            Wypożyczona = 1,
            Zarezerwowana = 2,
            Wycofana = 3
        }

        public int Id { get; set; } // Klucz główny
        public int BookId { get; set; } = bookId; // Klucz obcy do Book
        public AvailabilityEnum Availability { get; set; } = availability;

        public Book Book { get; set; } // Nawigacja do książki
    }
}