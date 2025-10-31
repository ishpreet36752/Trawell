import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/contants.js";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { getSocket } from "../utils/socket.jsx";

const LIMIT = 20;

export default function ChatMessages() {
  const { groupId } = useParams();
  const currentUser = useSelector((s) => s.user?.userData);
  const socket = getSocket();

  const containerRef = useRef(null);
  const topSentinelRef = useRef(null);
  const loadingRef = useRef(false); // ✅ prevent double fetch

  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // ✅ Fetch messages (with ?before param)
  const fetchMessages = useCallback(async (before = null) => {
    if (!groupId || loadingRef.current) return;
    loadingRef.current = true;
    try {
      const params = new URLSearchParams({ limit: LIMIT });
      if (before) params.append("before", before);

      const res = await axios.get(`${BASE_URL}/group-chat/${groupId}?${params}`, {
        withCredentials: true,
      });
      const data = res.data || {};
      return {
        chunk: Array.isArray(data.messages) ? data.messages : [],
        hasMore: !!data.hasMore,
      };
    } catch (err) {
      console.error("fetchMessages error:", err);
      return { chunk: [], hasMore: false };
    } finally {
      loadingRef.current = false;
    }
  }, [groupId]);

  // ✅ Load latest messages initially (not all history)
  useEffect(() => {
    if (!groupId) return;
    setMessages([]);
    setHasMore(true);
    setInitialLoaded(false);

    (async () => {
      const res = await fetchMessages();
      if (!res) return;
      setMessages(res.chunk.reverse()); // show latest at bottom
      setHasMore(res.hasMore);

      // scroll to bottom
      setTimeout(() => {
        const c = containerRef.current;
        if (c) c.scrollTop = c.scrollHeight;
        setInitialLoaded(true);
      }, 100);
    })();
  }, [groupId, fetchMessages]);

  // ✅ Handle incoming socket messages (real-time)
  useEffect(() => {
    if (!socket || !groupId) return;
    socket.emit("joinGroup", groupId);

    const onNewMessage = (msg) => {
      if (msg.groupId !== groupId) return;
      setMessages((prev) => [...prev, msg]);

      const c = containerRef.current;
      if (!c) return;
      const distance = c.scrollHeight - c.scrollTop - c.clientHeight;
      if (distance < 200) {
        setTimeout(() => (c.scrollTop = c.scrollHeight), 50);
      }
    };

    socket.on("newGroupMessage", onNewMessage);
    return () => socket.off("newGroupMessage", onNewMessage);
  }, [socket, groupId]);

  // ✅ Load older messages on scroll up
  const loadOlder = useCallback(async () => {
    if (!hasMore || loadingRef.current || messages.length === 0) return;

    const oldest = messages[0];
    const before = oldest?.createdAt;
    if (!before) return;

    const c = containerRef.current;
    const prevHeight = c?.scrollHeight || 0;

    const res = await fetchMessages(before);
    if (!res || res.chunk.length === 0) {
      setHasMore(false);
      return;
    }

    // prepend older messages (keep scroll position stable)
    setMessages((prev) => [...res.chunk.reverse(), ...prev]);

    setTimeout(() => {
      const newHeight = c.scrollHeight;
      c.scrollTop = newHeight - prevHeight;
    }, 60);

    setHasMore(res.hasMore);
  }, [hasMore, messages, fetchMessages]);

  // ✅ Observe top for lazy loading old messages
  useEffect(() => {
    if (!initialLoaded) return;
    const container = containerRef.current;
    const sentinel = topSentinelRef.current;
    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadOlder();
        }
      },
      { root: container, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [initialLoaded, loadOlder]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50"
      style={{ height: "80vh" }}
    >
      <div ref={topSentinelRef}></div>

      {messages.map((msg) => {
        const isMine = msg.sender?._id === currentUser?._id;
        return (
          <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                isMine
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {!isMine && (
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {msg.sender?.firstName || "User"}
                </p>
              )}
              <p>{msg.content}</p>
              <span
                className={`text-[10px] mt-1 block text-right ${
                  isMine ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
