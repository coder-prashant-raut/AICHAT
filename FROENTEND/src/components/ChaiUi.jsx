import { useState, useRef, useEffect, useCallback } from "react";
import { MdSend, MdVideoCall, MdCall } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";
import { motion } from "framer-motion";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

export default function ChaiApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: "user", timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://marathibatmya.in/",
          "X-Title": "Prashant",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat:free",
          messages: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })).concat({ role: "user", content: input }),
        }),
      });

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || "⚠️ AI didn't respond. Try again!";
      aiResponse = aiResponse.replace(/<think>.*?<\/think>/gs, "").trim();

      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai", timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { text: "⚠️ Error fetching response. Try again!", sender: "ai", timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading]);

  return (
    <div className="flex flex-col w-full h-screen max-w-lg mx-auto border rounded-lg bg-white shadow-lg chat-container">
      <header className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300 rounded-t-lg">
        <div className="flex items-center">
          <img
            src="https://avatars.githubusercontent.com/u/162595999?s=400&u=94658085da622b6ea236bec37bb78d016bc033c3&v=4"
            alt="Avatar"
            className="w-10 h-10 object-cover rounded-full"
          />
          <span className="ml-3 font-semibold text-gray-800">Prashant Raut</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">{time}</span>
          <MdCall size={20} className="text-gray-600 cursor-pointer hover:text-blue-500" />
          <MdVideoCall size={24} className="text-gray-600 cursor-pointer hover:text-blue-500" />
          <FaRegSmile size={20} className="text-gray-600 cursor-pointer hover:text-blue-500" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 chat-container" style={{ minHeight: "400px" }}>
        {messages.map(({ text, sender, timestamp }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg shadow-md text-sm max-w-xs ${
                sender === "user" ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{text}</p>
              <small className="block text-right text-xs text-gray-600 mt-1">{timestamp}</small>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="p-3 bg-gray-300 max-w-xs rounded-lg text-gray-800 text-sm shadow-md"
          >
            Typing...
          </motion.div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="p-4 bg-gray-100 flex items-center border-t border-gray-300 rounded-b-lg">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 outline-none text-gray-800"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          <MdSend size={20} />
        </button>
      </div>
    </div>
  );
}
