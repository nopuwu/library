using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Models
{
        // Reprezentuje rezerwację konkretnego egzemplarza książki przez użytkownika.
    public class Reservation(DateTime reservationDate, int copyId, int userId)
    {
        public int Id { get; set; } // Klucz główny
        public int UserId { get; set; } = userId; // Klucz obcy do User
        public int CopyId { get; set; } = copyId; // Klucz obcy do BookCopy
        public DateTime ReservationDate { get; set; } = reservationDate;

        public BookCopy Copy { get; set; } // Nawigacja do kopii
        public User User { get; set; } // Nawigacja do użytkownika
    }
}