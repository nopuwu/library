using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Dtos.Reservation
{
    public class CreateReservationDto
    {
        public int Id { get; set; }
        public DateTime ReservationDate { get; set; }
        public int BookCopyId { get; set; }
        public int UserId { get; set; }

    }
}