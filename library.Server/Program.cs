using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace library.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            //var builder = WebApplication.CreateBuilder(args);

            //// Add services to the container.

            //builder.Services.AddControllers();
            //// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            //var app = builder.Build();

            //app.UseDefaultFiles();
            //app.UseStaticFiles();

            //// Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}

            //app.UseHttpsRedirection();

            //app.UseAuthorization();


            //app.MapControllers();

            //app.MapFallbackToFile("/index.html");

            //app.Run();

            using var db = new LibraryContext();

            // Note: This sample requires the database to be created before running.
            Console.WriteLine($"Database path: {db.DbPath}.");

            // Create
            //Console.WriteLine("Inserting a new blog");
            //db.Add(new Blog { Url = "http://blogs.msdn.com/adonet" });
            //await db.SaveChangesAsync();

            // Read
            //Console.WriteLine("Querying for a blog");
            //var blog = await db.Blogs
            //    .OrderBy(b => b.Id)
            //    .FirstAsync();

            //Console.WriteLine($"Blog {blog.Id}, Url {blog.Url}");


            // Update
            //Console.WriteLine("Updating the blog and adding a post");
            //blog.Url = "https://devblogs.microsoft.com/dotnet";
            //blog.Posts.Add(
            //    new Post { Title = "Hello World", Content = "I wrote an app using EF Core!" });
            //await db.SaveChangesAsync();

            //var post = await db.Posts
            //    .OrderBy(p => p.Id)
            //    .FirstAsync();
            //Console.WriteLine($"Blog {blog.Id}, Url {blog.Url}, Post Title {post.Title}, Content {post.Content}");


            // Delete
            //Console.WriteLine("Delete the blog");
            //db.Remove(blog);
            //await db.SaveChangesAsync();
        }
    }
}
