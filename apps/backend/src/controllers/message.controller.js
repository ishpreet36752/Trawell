const Chat = require("../models/chats.js");
const Message = require("../models/message.js");

async function getGroupMessage(req, res) {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 4 } = req.query; // default: 7 messages per page

    // 1️⃣ Validate input
    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    // 2️⃣ Find chat linked to this group
    const chat = await Chat.findOne({ groupMeta: groupId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // 3️⃣ Pagination setup
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 4️⃣ Fetch messages with sender details (latest first)
    const messages = await Message.find({ chatId: chat._id })
      .populate("sender", "firstName lastName profileImage") // ✅ only sender details
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(parseInt(limit));

    // 5️⃣ Reverse messages for frontend chronological order
    const formattedMessages = messages.reverse();

    // 6️⃣ Total messages for frontend pagination
    const totalMessages = await Message.countDocuments({ chatId: chat._id });

    return res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
      messages: formattedMessages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = { getGroupMessage };
