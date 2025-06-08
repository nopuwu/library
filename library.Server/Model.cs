using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;
using System.Collections.Generic;
using System.Security.Cryptography;
using static library.Server.User;
using Microsoft.Data.Sqlite;

namespace library.Server
{
    // Główna klasa kontekstu bazy danych — zarządza połączeniem z bazą oraz mapowaniem modeli na tabele.
    public class LibraryContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookCopy> BookCopies { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Borrow> Borrowings { get; set; }
        public DbSet<Log> Logs { get; set; }

        public string DbPath { get; }

        // Ustawia ścieżkę do bazy danych SQLite w folderze lokalnych danych aplikacji użytkownika.
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options)
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = Path.Join(path, "library.db");
        }

        // Konfiguruje bazę danych jako plik SQLite w podanej ścieżce.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlite($"Data Source={DbPath}");
        }
    }

    // Reprezentuje użytkownika w systemie biblioteki. Może to być czytelnik, bibliotekarz lub administrator.
    public class User(string username, string email, User.RoleEnum role = 0, User.UserStatusEnum status = 0)
    {
        public enum RoleEnum
        {
            Czytelnik = 0,
            Bibliotekarz = 1,
            Admin = 2
        }

        public enum UserStatusEnum
        {
            Aktywny = 0,
            Zablokowany = 1
        }

        public int Id { get; set; } // Klucz główny
        public string Username { get; set; } = username;
        public string Email { get; set; } = email;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public RoleEnum Role { get; set; } = role;
        public UserStatusEnum Status { get; set; } = status;

        // Nawigacyjne właściwości do powiązanych encji
        public List<Reservation> Reservations { get; } = new();
        public List<Borrow> Borrowings { get; } = new();

        public void SetPassword(string password)
        {
            using var hmac = new HMACSHA512();
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            PasswordSalt = hmac.Key;
        }

        public bool VerifyPassword(string password)
        {
            using var hmac = new HMACSHA512(PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(PasswordHash);
        }
    }


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

    // Reprezentuje dziennik (log) zdarzeń wykonanych przez użytkownika, np. rezerwacje, wypożyczenia itp.
    public class Log(int userId, string action, DateTime timeStamp)
    {
        public int Id { get; set; } // Klucz główny
        public int UserId { get; set; } = userId; // Klucz obcy do User
        public string Action { get; set; } = action; // Opis akcji (np. "Wypożyczenie książki")
        public DateTime TimeStamp { get; set; } = timeStamp; // Czas wykonania akcji
    }

}
