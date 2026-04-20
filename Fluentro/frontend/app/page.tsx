"use client";
import { useState, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const savedChats = localStorage.getItem("fluentro_chats");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fluentro_chats", JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const sendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          title:
            chat.messages.length === 0
              ? message.slice(0, 25)
              : chat.title,
          messages: [...chat.messages, { role: "user", content: message }],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setMessage("");

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    const updatedWithReply = updatedChats.map((chat) => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { role: "assistant", content: data.reply },
          ],
        };
      }
      return chat;
    });

    setChats(updatedWithReply);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      
      {/* Sidebar */}
      <div className="w-1/4 backdrop-blur-xl bg-white/30 border-r border-white/40 p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Fluentro</h2>

        <button
          onClick={createNewChat}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-xl shadow-lg hover:scale-105 transition mb-4"
        >
          + New Chat
        </button>

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`p-3 mb-2 rounded-xl cursor-pointer transition ${
              activeChatId === chat.id
                ? "bg-white/70 shadow-md"
                : "hover:bg-white/50"
            }`}
          >
            <p className="text-gray-800 font-medium truncate">
              {chat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ✨ Fluentro AI
        </h1>

        <div className="flex-1 backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl p-6 overflow-y-auto mb-6">
          {activeChat?.messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-lg text-gray-900 ${
                  msg.role === "user"
                    ? "bg-indigo-500 text-white"
                    : "bg-white/80"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {!activeChat && (
            <p className="text-gray-700 text-center mt-20">
              Create or select a chat to start ✨
            </p>
          )}
        </div>

        {activeChat && (
          <div className="flex gap-3">
            <input
              className="flex-1 p-3 rounded-xl bg-white/80 text-gray-900 border border-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}