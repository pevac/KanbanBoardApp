using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace KanbanBoardApi.Models
{
    public class Card
    {
        public string Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        [Required]
        public State State { get; set; }
    }

    public enum State
    {
        New = 0,
        Todo = 1,
        InProgress = 2,
        Done = 3
    }
}
