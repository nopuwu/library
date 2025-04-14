using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace library.Server
{
    public class LibraryContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookCopy> BookCopies { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Borrow> Borrowings { get; set; }
        public DbSet<Log> Logs { get; set; }

        public string DbPath { get; }

        public LibraryContext()
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = System.IO.Path.Join(path, "library.db");
        }

        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Blog>()
        //        .HasMany(e => e.Posts)
        //        .WithOne(e => e.Blog)
        //        .HasForeignKey(e => e.BlogId)
        //        .HasPrincipalKey(e => e.Id);
        //}
    }

    public class User
    {
        public enum Role
        {
            Admin,
            Bibliotekarz,
            Czytelnik
        }

        public enum Status
        {
            Aktywny,
            Zablokowany
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }

    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Isbn { get; set; }
        public int Copies { get; set; }

    }

    public class BookCopy
    {
        public int Id {  get; set; }
        public enum Availability {
            Dostępna,
            Wypożyczona,
            Zarezerwowana,
            Wycofana
        }

        public int BookId { get; set; }
        public Book Book { get; set; }
    }

    public class Reservation
    {
        public int Id {  get; set; }
        public DateTime ReservationDate { get; set; }

        public int UnitId { get; set; }
        public BookCopy Copy { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }

    public class Borrow
    {
        public int Id { get; set; }
        public DateTime BorrowDate { get; set; }
        public enum Status
        {
            Wypożyczona,
            Zwrócona
        }
        public DateTime ReturnDate { get; set; }

        public int UnitId { get; set; }
        public BookCopy Copy { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }

    public class Log
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Action { get; set; }
        public DateTime TimeStamp { get; set; }
    }

}
