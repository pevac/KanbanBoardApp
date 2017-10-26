using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KanbanBoardApi.Models
{
    public class CardContext : DbContext
    {
        public DbSet<Card> Cards { get; set; }
        public CardContext(DbContextOptions<CardContext> options)
            : base(options)
        {
        }
    }
}
