using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using static library.Server.User;

namespace library.Server
{
    public class LibraryContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookCopy> BookCopies { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Borrow> Borrowings { get; set; }
        public DbSet<Log> Logs { get; set; }

        public string DbPath { get; }

        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options)
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = Path.Join(path, "library.db");
        }

        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");
    }

    public class User(string username, string password, string email, User.RoleEnum role = 0, User.UserStatusEnum status = 0)
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

        public int Id { get; set; }
        public string Username { get; set; } = username;
        public string Password { get; set; } = password;
        public string Email { get; set; } = email;
        public RoleEnum Role { get; set; } = role;
        public UserStatusEnum Status { get; set; } = status;

        public List<Reservation> Reservations { get; } = new();
        public List<Borrow> Borrowings { get; } = new();
    }

    public class Book(string title, string author, string genre, string isbn, int copies = 1)
    {
        public int Id { get; set; }
        public string Title { get; set; } = title;
        public string Author { get; set; } = author;
        public string Genre { get; set; } = genre;
        public int Copies { get; set; } = copies;
        public string Isbn { get; set; } = isbn;

        public List<BookCopy> BookCopies { get; } = new();
    }

    public class BookCopy(int bookId, BookCopy.AvailabilityEnum availability = 0)
    {
        public enum AvailabilityEnum
        {
            Dostępna = 0,
            Wypożyczona = 1,
            Zarezerwowana = 2,
            Wycofana = 3
        }

        public int Id { get; set; }
        public int BookId { get; set; } = bookId;
        public AvailabilityEnum Availability { get; set; } = availability;

        public Book Book { get; set; }
    }

    public class Reservation(DateTime reservationDate, int copyId, int userId)
    {
        public int Id { get; set; }
        public int UserId { get; set; } = userId;
        public int CopyId { get; set; } = copyId;
        public DateTime ReservationDate { get; set; } = reservationDate;

        public BookCopy Copy { get; set; }
        public User User { get; set; }
    }

    public class Borrow(DateTime borrowDate, DateTime returnDate, Borrow.BorrowingStatusEnum status, int copyId, int userId)
    {
        public enum BorrowingStatusEnum
        {
            Wypożyczona = 0,
            Zwrócona = 1
        }

        public int Id { get; set; }
        public int UserId { get; set; } = userId;
        public int CopyId { get; set; } = copyId;
        public DateTime BorrowDate { get; set; } = borrowDate;
        public DateTime ReturnDate { get; set; } = returnDate;
        public BorrowingStatusEnum Status { get; set; } = status;

        public BookCopy Copy { get; set; }
        public User User { get; set; }
    }

    public class Log(int userId, string action, DateTime timeStamp)
    {
        public int Id { get; set; }
        public int UserId { get; set; } = userId;
        public string Action { get; set; } = action;
        public DateTime TimeStamp { get; set; } = timeStamp;
    }

}
