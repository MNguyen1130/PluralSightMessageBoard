using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MessageBoard.Data
{
    public class Reply
    {
        public int Id { get; set; }
        public string body { get; set; }
        public DateTime Created { get; set; }

        public int TopicId { get; set; }

    }
}
