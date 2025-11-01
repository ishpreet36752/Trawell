import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getSocket } from "../utils/socket";
import { useParams } from "react-router";

function MessageInput() {
  const [content, setContent] = useState("");
  const socket = getSocket();
  const { groupId } = useParams();

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || !groupId) return;

    socket.emit("sendGroupMessage", { groupId, content: trimmed });
    setContent("");
  };

  return (
    <form onSubmit={sendMessage} className="flex items-center gap-2 border-t bg-white p-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
