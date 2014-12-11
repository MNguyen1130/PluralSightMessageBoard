using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MessageBoard.Data
{
    public class MesageBoardRepository : IMessageBoardRepository
    {
        public IQueryable<Topic> GetTopics()
        {
            throw new NotImplementedException();
        }

        public IQueryable<Reply> GetRepliesByTopic(int topicId)
        {
            throw new NotImplementedException();
        }
    }
}