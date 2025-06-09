using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Models
{
    // Reprezentuje dziennik (log) zdarzeń wykonanych przez użytkownika, np. rezerwacje, wypożyczenia itp.
    public class Log(int userId, string action, DateTime timeStamp)
    {
        public int Id { get; set; } // Klucz główny
        public int UserId { get; set; } = userId; // Klucz obcy do User
        public string Action { get; set; } = action; // Opis akcji (np. "Wypożyczenie książki")
        public DateTime TimeStamp { get; set; } = timeStamp; // Czas wykonania akcji
    }
}