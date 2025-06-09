using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using library.Server.Dtos.Borrow;
using library.Server.Models;

namespace library.Server.Mappers
{
    public static class BorrowMapper
    {
        public static CreateBorrowDto MapToDto(this Borrow borrow)
        {
            return new CreateBorrowDto
            {
                BorrowDate = borrow.BorrowDate,
                ReturnDate = borrow.ReturnDate,
                Status = (int)borrow.Status,
                UserId = borrow.UserId,
                CopyId = borrow.CopyId
            };
        }
    }
}