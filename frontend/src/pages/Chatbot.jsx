import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Chatbot = () => {
  const { backendUrl } = useContext(ShopContext);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm Forever AI Assistant. Ask me anything!",
    },
  ]);

  // ✅ Scroll ref
  const chatEndRef = useRef(null);

  // ✅ Auto-scroll whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(backendUrl + "/api/chatbot", {
        message: input,
      });

      const botMsg = {
        sender: "bot",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Sorry, something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* ✅ Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-black text-white px-4 py-2 rounded-full shadow-md"
      >
        💬 AI Chat
      </button>

      {/* ✅ Window */}
      {open && (
        <div className="w-80 h-[450px] bg-white shadow-xl rounded-xl mt-3 flex flex-col border overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-3 text-sm font-semibold">
            Forever AI Assistant
          </div>

          {/* ✅ Scrollable Chat Area */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg max-w-[90%] whitespace-pre-wrap break-words ${
                  msg.sender === "user"
                    ? "bg-gray-200 self-end text-right"
                    : "bg-gray-100 self-start text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="bg-gray-100 px-3 py-2 rounded-lg self-start">
                Typing... ⏳
              </div>
            )}

            {/* ✅ Auto-scroll target */}
            <div ref={chatEndRef}></div>
          </div>

          {/* ✅ Input Section */}
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border px-3 py-2 rounded text-sm outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
