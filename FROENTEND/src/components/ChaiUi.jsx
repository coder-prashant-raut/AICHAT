import { useState, useRef, useEffect } from "react";
import { MdSend, MdVideoCall, MdCall } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

const themes = {
  blue: {
    bg: "bg-gradient-to-br from-blue-100 to-blue-200",
    text: "text-gray-900",
    primary: "bg-blue-600",
    input: "border-blue-300 text-gray-900 bg-white",
  },
  green: {
    bg: "bg-gradient-to-br from-green-100 to-green-200",
    text: "text-gray-900",
    primary: "bg-green-600",
    input: "border-green-300 text-gray-900 bg-white",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-100 to-purple-200",
    text: "text-gray-900",
    primary: "bg-purple-600",
    input: "border-purple-300 text-gray-900 bg-white",
  },
  red: {
    bg: "bg-gradient-to-br from-red-100 to-red-200",
    text: "text-gray-900",
    primary: "bg-red-600",
    input: "border-red-300 text-gray-900 bg-white",
  },
  dark: {
    bg: "bg-gradient-to-br from-gray-900 to-gray-800",
    text: "text-white",
    primary: "bg-gray-700",
    input: "border-gray-600 text-white bg-gray-800 placeholder-gray-400",
  },
};


export default function ChaiMate() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [theme, setTheme] = useState("blue");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateMessages = (msgs) => {
    setMessages(msgs);
    localStorage.setItem("chatHistory", JSON.stringify(msgs));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { text: input, sender: "user", timestamp: new Date().toLocaleTimeString() };
    const newMsgs = [...messages, userMsg];
    updateMessages(newMsgs);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://marathibatmya.in/",
          "X-Title": "Prashant",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat:free",
          messages: [
            {
              role: "system",
              content:
                "Your name is Prashant. You are a friendly, sweet, and happy person who interacts like a real human. Use emojis, make it warm and engaging.",
            },
            ...newMsgs.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          ],
        }),
      });

      const data = await res.json();
      let reply = data.choices?.[0]?.message?.content || "Hmm... I couldn't respond.";
      reply = reply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

      updateMessages([...newMsgs, { text: reply, sender: "ai", timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      updateMessages([
        ...newMsgs,
        { text: "⚠️ Couldn't fetch response. Try again!", sender: "ai", timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${themes[theme].bg} ${themes[theme].text}`}>
      <div className="w-full max-w-2xl h-screen flex flex-col border border-gray-300 shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className={`flex justify-between items-center px-4 py-3 ${themes[theme].primary} text-white`}>
          <div className="flex items-center gap-3">
            <img
              src="https://i.imgur.com/MwZwkNw.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
            <div>
              <h1 className="font-bold text-lg">Prashant Raut</h1>
              <p className="text-xs text-gray-200 flex items-center gap-1">
                <FaCircle className="text-green-400 text-[8px]" /> Online
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {Object.keys(themes).map((t) => (
              <div
                key={t}
                onClick={() => setTheme(t)}
                className={`w-5 h-5 rounded-full cursor-pointer border-2 ${
                  theme === t ? "scale-110 border-white" : "border-gray-300"
                } ${themes[t].primary}`}
              />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          <style>{`::-webkit-scrollbar { display: none; }`}</style>
          {messages.map(({ text, sender, timestamp }, i) => (
            <div key={i} className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 max-w-sm text-sm shadow-md rounded-2xl ${
                  sender === "user"
                    ? "bg-white text-gray-900 rounded-br-none"
                    : `${themes[theme].primary} text-white rounded-bl-none`
                }`}
              >
                <p>{text}</p>
                <small className="block mt-1 text-right text-[10px] opacity-70">{timestamp}</small>
              </motion.div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className={`p-3 max-w-xs rounded-2xl text-sm ${themes[theme].primary} text-white shadow-md`}>
                <p className="animate-pulse">Typing...</p>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className={`flex items-center px-4 py-3 bg-white border-t ${themes[theme].input}`}>
        <input
  type="text"
  className={`flex-grow p-2 rounded-full shadow-sm outline-none ${themes[theme].input} placeholder:text-sm`}
  placeholder="Type something..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
/>

          <button
            className={`ml-3 p-2 rounded-full shadow-md text-white ${themes[theme].primary}`}
            onClick={sendMessage}
            disabled={loading}
          >
            <MdSend size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
