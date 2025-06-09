using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using library.Server.Data;
using library.Server.Models;

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

            // Konfiguracja Swaggera dla dokumentacji API.
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });

            builder.Services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            // Rejestracja usług autoryzacji.
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminOrLibrarian", policy =>
                    policy.RequireRole("Admin", "Bibliotekarz"));
            });

            // Konfiguracja Entity Framework Core z użyciem SQLite.
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite($"Data Source={Path.Join(Environment
                .GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "library.db")}"));

            // Konfiguracja Identity dla uwierzytelniania użytkowników.
            builder.Services.AddIdentityApiEndpoints<IdentityUser>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            builder.Services.AddScoped<AuthService>();

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
            app.UseAuthentication();
            app.UseAuthorization();

            // Mapowanie kontrolerów.
            app.MapControllers();

            // Obsługa fallbacku dla aplikacji SPA.
            app.MapFallbackToFile("/index.html");

            await InitializeDatabase(app);

            app.Run();
        }

        static async Task InitializeDatabase(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Upewnij się, że baza istnieje
            await context.Database.EnsureCreatedAsync();

            // Sprawdź czy użytkownicy już istnieją
            if (!await context.Users.AnyAsync())
            {
                // Utwórz admina
                var admin = new User("admin", "admin@gmail.com", User.RoleEnum.Admin)
                {
                    Status = User.UserStatusEnum.Aktywny
                };
                admin.SetPassword("admin"); // Hashowanie hasła

                // Utwórz bibliotekarza
                var librarian = new User("librarian", "librarian@gmail.com", User.RoleEnum.Bibliotekarz)
                {
                    Status = User.UserStatusEnum.Aktywny
                };
                librarian.SetPassword("librarian");

                // Dodaj do bazy
                context.Users.AddRange(admin, librarian);
                await context.SaveChangesAsync();

                Console.WriteLine("Dodano domyślnych użytkowników:");
                Console.WriteLine($"- admin (rola: Admin)");
                Console.WriteLine($"- librarian (rola: Bibliotekarz)");
            }
        }
    }
}