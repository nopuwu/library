using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace library.Server.Models
{
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
}