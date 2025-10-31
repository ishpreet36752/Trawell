const Chat = require("../models/chats.js");
const Message = require("../models/message.js");

async function getGroupMessage(req, res) {
  try {
    const { groupId } = req.params;
    const { before, limit = 10 } = req.query;

    if (!groupId) {
      return res.status(400).json({ success: false, message: "Group ID required" });
    }

    const chat = await Chat.findOne({ groupMeta: groupId });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    const query = { chatId: chat._id };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate("sender", "firstName lastName profileImage")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const totalCount = await Message.countDocuments({ chatId: chat._id });

    res.status(200).json({
      success: true,
      messages: messages.reverse(), // chronological order
      hasMore: messages.length > 0 && messages.length < totalCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = { getGroupMessage };

