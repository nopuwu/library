using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using library.Server.Models;

namespace library.Server.Data
{
        // Główna klasa kontekstu bazy danych — zarządza połączeniem z bazą oraz mapowaniem modeli na tabele.
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookCopy> BookCopies { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Borrow> Borrowings { get; set; }
        public DbSet<Log> Logs { get; set; }

        public string DbPath { get; }

        // Ustawia ścieżkę do bazy danych SQLite w folderze lokalnych danych aplikacji użytkownika.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = Path.Join(path, "library.db");
        }

        // Konfiguruje bazę danych jako plik SQLite w podanej ścieżce.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlite($"Data Source={DbPath}");
            Console.WriteLine($"Database path: {DbPath}");
        }
    }
}