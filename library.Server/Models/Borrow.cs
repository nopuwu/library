using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Models
{
    // Reprezentuje wypożyczenie książki. Zawiera daty oraz status wypożyczenia.
    public class Borrow(DateTime borrowDate, DateTime returnDate, Borrow.BorrowingStatusEnum status, int copyId, int userId)
    {
        public enum BorrowingStatusEnum
        {
            Wypożyczona = 0,
            Zwrócona = 1
        }

        public int Id { get; set; } // Klucz główny
        public int UserId { get; set; } = userId; // Klucz obcy do User
        public int CopyId { get; set; } = copyId; // Klucz obcy do BookCopy
        public DateTime BorrowDate { get; set; } = borrowDate;
        public DateTime ReturnDate { get; set; } = returnDate;
        public BorrowingStatusEnum Status { get; set; } = status;

        public BookCopy Copy { get; set; } // Nawigacja do egzemplarza
        public User User { get; set; } // Nawigacja do użytkownika
    }
}