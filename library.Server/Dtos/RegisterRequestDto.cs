
/// Reprezentuje dane transferowe (DTO) dla rejestracji.
/// Używane do przesyłania danych między klientem a serwerem.
namespace library.Server.Dtos
{
    public class RegisterRequestDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}