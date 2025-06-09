using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace library.Server.Dtos.Book
{
    public class CreateBookRequest
    {
        public BookDto Book { get; set; }
        public int CopyCount { get; set; }
    }
}