using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using library.Server.Dtos.Reservation;
using library.Server.Models;

namespace library.Server.Mappers
{
    public static class ReservationMapper
    {
        public static CreateReservationDto MapToDto(this Reservation reservation)
        {
            return new CreateReservationDto
            {
                ReservationDate = reservation.ReservationDate,
                BookCopyId = reservation.CopyId,
                UserId = reservation.UserId
            };
        }
    }
}