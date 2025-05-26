using System;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace library.Server
{
    public class Program
    {
        // Punkt wejścia aplikacji. Konfiguruje usługi i middleware.
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Pozwala na połączenie się frontendu do backendu, nie powinno być AllowAll ale z tym działa
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
            });

            // Rejestracja kontrolerów.
            builder.Services.AddControllers();

            // Rejestracja usług autoryzacji.
            builder.Services.AddAuthorization();

            // Konfiguracja Swaggera dla dokumentacji API.
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Konfiguracja Entity Framework Core z użyciem SQLite.
            builder.Services.AddDbContext<LibraryContext>(options =>
                options.UseSqlite($"Data Source={Path.Join(Environment
                .GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "library.db")}"));

            // Konfiguracja Identity dla uwierzytelniania użytkowników.
            builder.Services.AddIdentityApiEndpoints<IdentityUser>()
                .AddEntityFrameworkStores<LibraryContext>();

            var app = builder.Build();

            // Włączenie CORS
            app.UseCors("AllowAll");

            // Mapowanie endpointów Identity.
            app.MapIdentityApi<IdentityUser>();

            // Obsługa plików statycznych i domyślnych.
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Konfiguracja Swaggera w środowisku deweloperskim.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Przekierowanie HTTP do HTTPS.
            app.UseHttpsRedirection();

            // Middleware autoryzacji.
            app.UseAuthorization();

            // Mapowanie kontrolerów.
            app.MapControllers();

            // Obsługa fallbacku dla aplikacji SPA.
            app.MapFallbackToFile("/index.html");

            app.Run();


            //using var db = new LibraryContext();

            //Console.WriteLine($"Database path: {db.DbPath}.");

            //AddUser(db, "mwalecki", "123321", "mwalecki@gmail.com", 2);
            //AddUser(db, "mwaleckiii", "12332111", "mwaleckiii@gmail.com", 0);
            //AddUser(db, "mwalecki", "123321", "mwalecki@gmail.com", 0);

            //Console.WriteLine("Querying for a user...");
            //var users = db.Users;
            //for (int i = 0; i < users.Count(); i++)
            //{
            //    Console.WriteLine($"User {users.ElementAt(i).Id}, username {users.ElementAt(i).Username}, password {users.ElementAt(i).Password}, email {users.ElementAt(i).Email}, role {users.ElementAt(i).Role}, status {users.ElementAt(i).Status}.");
            //}

            //Console.WriteLine("\nQuerying for a logs...");
            //var logs = db.Logs;
            //for (int i = 0; i < logs.Count(); i++)
            //{
            //    Console.WriteLine($"Log ID: {logs.ElementAt(i).Id}, Action: \"{logs.ElementAt(i).Action}\", Timestamp: {logs.ElementAt(i).TimeStamp}.");
            //}

            //for (int i = 0; i < users.Count(); i++)
            //{
            //    AddBook(db, users.ElementAt(i), $"Test Book{i}", "Test Author", "Test Genre", $"123456789012{i + 1}");
            //}

            //AddBook(db, users.ElementAt(0), $"Test Book{0}", "Test Author", "Test Genre", $"123456789012{0}");

            //Console.WriteLine("\nQuerying for a books...");
            //var books = db.Books;
            //for (int i = 0; i < books.Count(); i++)
            //{
            //    Console.WriteLine($"Book ID: {books.ElementAt(i).Id}, Title: {books.ElementAt(i).Title}, Author: {books.ElementAt(i).Author}, Genre: {books.ElementAt(i).Genre}, ISBN: {books.ElementAt(i).Isbn}, Copies: {books.ElementAt(i).Copies}.");
            //}

            //Console.WriteLine("\nQuerying for a logs...");
            ////logs = db.Logs;
            //for (int i = 0; i < logs.Count(); i++)
            //{
            //    Console.WriteLine($"Log ID: {logs.ElementAt(i).Id}, Action: \"{logs.ElementAt(i).Action}\", Timestamp: {logs.ElementAt(i).TimeStamp}.");
            //}
        }

        //public static async void AddUser(LibraryContext db, string Username, string Password, string Email, int Role)
        //{
        //    if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password) || string.IsNullOrEmpty(Email))
        //    {
        //        Console.WriteLine("\nAll fields are required.");
        //        AddLog(db, -1, "Tried to add a user without filling out required fields.", DateTime.Now);
        //        return;
        //    }
        //    if (db.Users.Any(u => u.Username == Username))
        //    {
        //        Console.WriteLine("\nUser with this username already exists.");
        //        AddLog(db, -1, "Tried to add a user with username that already exists.", DateTime.Now);
        //        return;
        //    }
        //    if (db.Users.Any(u => u.Email == Email))
        //    {
        //        Console.WriteLine("\nUser with this email already exists.");
        //        AddLog(db, -1, "Tried to add a user with email that already exists.", DateTime.Now);
        //        return;
        //    }
        //    if (Role < 0 || Role > 2)
        //    {
        //        Console.WriteLine("\nInvalid role.");
        //        AddLog(db, -1, "Tried to add a user with invalid role.", DateTime.Now);
        //        return;
        //    }

        //    // Maybe later implement hashing for passwords
        //    Console.WriteLine($"\nInserting a new user: {Username}, {Password}, {Role}, {Email}.");
        //    db.Add(new User(Username, Password, Email, (User.RoleEnum)Role));
        //    await db.SaveChangesAsync();
        //    Console.WriteLine("User added successfully!");

        //    var user = db.Users.First(u => u.Username == Username && u.Email == Email && u.Role == (User.RoleEnum)Role);
        //    AddLog(db, user.Id, "User registered.", DateTime.Now);

        //    return;
        //}

        //public static async void ModifyUser()
        //{


        //    return;
        //}

        //public static async void DeleteUser()
        //{


        //    return;
        //}

        //public static async void AddBook(LibraryContext db, User user, string Title, string Author, string Genre, string ISBN)
        //{
        //    if (user.Role != User.RoleEnum.Bibliotekarz && user.Role != User.RoleEnum.Admin)
        //    {
        //        Console.WriteLine($"\nUser with ID = {user.Id} tried to add a book! User doesn't have permission!");
        //        AddLog(db, user.Id, "Tried to add a book.", DateTime.Now);
        //        return;
        //    }
        //    if (string.IsNullOrEmpty(Title) || string.IsNullOrEmpty(Author) || string.IsNullOrEmpty(Genre) || string.IsNullOrEmpty(ISBN))
        //    {
        //        Console.WriteLine($"\nUser with ID = {user.Id} tried to add a book without filling out required fields!");
        //        AddLog(db, user.Id, "Tried to add a book without filling out required fields.", DateTime.Now);
        //        return;
        //    }
        //    if (db.Books.Any(b => b.Isbn == ISBN))
        //    {
        //        Console.WriteLine($"\nUser with ID = {user.Id} tried to add a book with the same ISBN as another book!");
        //        AddLog(db, user.Id, "Tried to add a book with the same ISBN as another book.", DateTime.Now);
        //        return;
        //    }
        //    if (db.Books.Any(b => b.Title == Title && b.Author == Author && b.Genre == Genre))
        //    {
        //        Console.WriteLine($"\nInserting a new book copy: {Title}, {Author}, {Genre}, {ISBN}.");
        //        int copies = db.Books.Count();
        //        var bookQuery = await db.Books.Where(b => b.Title == Title && b.Author == Author && b.Genre == Genre).FirstAsync();
        //        bookQuery.Copies = ++copies;

        //        BookCopy bookCopy = new(bookQuery.Id);
        //        db.Add(bookCopy);

        //        await db.SaveChangesAsync();
        //        Console.WriteLine("Book copy added successfully!");

        //        AddLog(db, user.Id, "Book copy added.", DateTime.Now);

        //        return;
        //    }
        //    else
        //    {
        //        Console.WriteLine($"\nInserting a new book: {Title}, {Author}, {Genre}, {ISBN}.");
        //        Book book = new(Title, Author, Genre, ISBN);
        //        db.Add(book);
        //        await db.SaveChangesAsync();

        //        BookCopy bookCopy = new(book.Id);
        //        db.Add(bookCopy);
        //        await db.SaveChangesAsync();

        //        Console.WriteLine("Book added successfully!");

        //        AddLog(db, user.Id, "Book added.", DateTime.Now);

        //        return;
        //    }
        //}

        //public static async void ModifyBook(LibraryContext db)
        //{


        //    return;
        //}

        //public static async void DeleteBook(LibraryContext db)
        //{


        //    return;
        //}

        //public static async void AddReservation(LibraryContext db)
        //{

        //    return;
        //}

        //public static async void DeleteReservation(LibraryContext db)
        //{

        //    return;
        //}

        //public static async void AddBorrowing(LibraryContext db)
        //{

        //    return;
        //}

        //public static async void ExtendBorrowing(LibraryContext db)
        //{

        //    return;
        //}

        //public static async void AddLog(LibraryContext db, int UserId, string Action, DateTime timestamp)
        //{
        //    Console.WriteLine("Adding new log...");
        //    Log log = new(UserId, Action, timestamp);
        //    db.Add(log);

        //    await db.SaveChangesAsync();

        //    Console.WriteLine("Log added successfully!\n");

        //    return;
        //}
    }
}