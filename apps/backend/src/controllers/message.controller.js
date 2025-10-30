const Chat = require("../models/chats.js");
const Message = require("../models/message.js");
const { paginate } = require("../utilis/pagination.js");

async function getGroupMessage(req, res) {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 4 } = req.query; // default: 7 messages per page

    //  Validate input
    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    //  Find chat linked to this group
    const chat = await Chat.findOne({ groupMeta: groupId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }


    //  Fetch messages with sender details (latest first)
   
    const paginated = await paginate(Message, { chatId: chat._id }, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: { path: "sender", select: "firstName lastName profileImage" },
    });
 //  Reverse for chronological order
    paginated.results.reverse();


    return res.status(200).json({
      success: true,
      currentPage: paginated.currentPage,
      totalPages: paginated.totalPages,
      totalMessages:paginated.totalDocuments,
      messages: paginated.results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = { getGroupMessage };
