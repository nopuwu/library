using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Dtos.Borrow
{
    public class CreateBorrowDto
    {
        public int UserId { get; set; }
        public int CopyId { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public int Status { get; set; } // 0 - borrowed, 1 - returned, 2 - overdue
    }
}