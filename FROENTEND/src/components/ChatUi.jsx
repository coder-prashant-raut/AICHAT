import { useState, useRef, useEffect } from "react";
import { MdSend, MdVideoCall, MdCall } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";
import { motion } from "framer-motion";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;


const themes = {
  blue: { bg: "bg-blue-200", text: "text-gray-900" },
  green: { bg: "bg-green-200", text: "text-gray-900" },
  purple: { bg: "bg-purple-200", text: "text-gray-900" },
  red: { bg: "bg-red-200", text: "text-gray-900" },
  dark: { bg: "bg-gray-800", text: "text-white" },
};

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const chatEndRef = useRef(null);

const [theme, setTheme] = useState("blue");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: "user", timestamp: new Date().toLocaleTimeString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
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
          messages: [
            {
              role: "system",
              content:
              "Your name is Prashant. You are a friendly, sweet, and happy person who interacts like a real human. You think internally but only show the final choice as a response. Your replies should always be detailed, engaging, and warm, making conversations feel natural and enjoyable. Use emojis for better engagement. Never say 'I don’t know', 'I’m not sure', or similar phrases. If you don’t understand something, ask clarifying questions or provide a related response that keeps the conversation flowing. Always try to help the user in the best way possible, even if you need to redirect them to another resource or topic. Be creative and proactive in your responses.",
            },
            ...updatedMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          ],
        }),
      });

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || "I'm not sure how to respond.";
      
      aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

      const aiMessage = { text: aiResponse, sender: "ai", timestamp: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { text: "⚠️ Error fetching response. Try again!", sender: "ai", timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="flex flex-col w-dvw h-svh max-w-lg mx-auto border rounded-lg bg-white shadow-lg chat-container">
    //   {/* Header */}
    //   <header className="flex justify-between fixed w-full items-center p-4 bg-gray-100 border-b border-gray-300 rounded-t-lg">
    //     <div className="flex items-center">
    //       <img
    //         src="https://avatars.githubusercontent.com/u/162595999?s=400&u=94658085da622b6ea236bec37bb78d016bc033c3&v=4"
    //         alt="Avatar"
    //         className="w-10 h-10 object-cover rounded-full"
    //       />
    //       <span className="ml-3 font-semibold text-gray-800">Prashant Raut</span>
    //     </div>
    //     <div className="flex items-center space-x-3 ">
    //       <span className="text-sm text-gray-600">{time}</span>
    //       <MdCall size={20} className="text-gray-600 cursor-pointer hover:text-blue-500" />
    //       <MdVideoCall size={24} className="text-gray-600 cursor-pointer hover:text-blue-500" />
    //       <FaRegSmile size={20} className="text-gray-600 cursor-pointer hover:text-blue-500" />
    //     </div>
    //   </header>

    //   {/* Messages Area */}
    //   <div className="flex-1 overflow-y-auto p-4 py-18 space-y-4 bg-gray-50 chat-container"  style={{ minHeight: "400px" }}>
    //     {messages.map(({ text, sender, timestamp }, index) => (
    //       <motion.div
    //         key={index}
    //         initial={{ opacity: 0, y: 10 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ duration: 0.3 }}
    //         className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
    //       >
    //         <div
    //           className={`p-3 rounded-lg shadow-md text-sm max-w-xs ${
    //             sender === "user" ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-800"
    //           }`}
    //         >
    //           <p>{text}</p>
    //           <small className="block text-right text-xs text-gray-600 mt-1">{timestamp}</small>
    //         </div>
    //       </motion.div>
    //     ))}
    //     {loading && (
    //       <motion.div
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         transition={{ repeat: Infinity, duration: 1 }}
    //         className="p-3 bg-gray-300 max-w-xs rounded-lg text-gray-800 text-sm shadow-md"
    //       >
    //        Typing...
    //       </motion.div>
    //     )}
    //     <div ref={chatEndRef}></div>
    //   </div>

    //   {/* Input Area */}
    //   <div className="p-2 bg-gray-100 flex items-center border-t border-gray-300 rounded-b-lg">
    //     <input
    //       type="text"
    //       className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 outline-none text-gray-800"
    //       placeholder="Type a message..."
    //       value={input}
    //       onChange={(e) => setInput(e.target.value)}
    //       onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    //     />
    //     <button
    //       className="ml-2 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50"
    //       onClick={sendMessage}
    //       disabled={loading}
    //     >
    //       <MdSend size={20} />
    //     </button>
    //   </div>
    // </div>

    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
    <div className="w-full max-w-lg h-full md:h-[90vh] flex flex-col bg-white shadow-2xl rounded-xl border overflow-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-blue-500 text-white shadow-md">
        <div className="flex items-center">
          <img
            src="https://avatars.githubusercontent.com/u/162595999?s=400"
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="ml-3 font-semibold">Prashant Raut</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm">{time}</span>
          <MdCall size={20} className="cursor-pointer hover:text-gray-200" />
          <MdVideoCall size={24} className="cursor-pointer hover:text-gray-200" />
          {/* Theme Switcher */}
          <select
            className="p-2 bg-white text-gray-800 border rounded-md"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </header>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
        style={{
          willChange: "transform",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {messages.map(({ text, sender, timestamp }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-2xl shadow-md text-sm max-w-xs ${
                sender === "user"
                  ? `${themes[theme].bg} ${themes[theme].text}`
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{text}</p>
              <small className="block text-right text-xs text-gray-700 mt-1">
                {timestamp}
              </small>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="p-3 bg-gray-300 max-w-xs rounded-2xl text-gray-800 text-sm shadow-md"
          >
            Typing...
          </motion.div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white flex items-center border-t border-gray-300">
        <input
          type="text"
          className="flex-1 p-3 rounded-full border border-gray-300 focus:ring focus:ring-blue-300 outline-none text-gray-800 shadow-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          <MdSend size={20} />
        </button>
      </div>
    </div>
  </div>
    
  );
}
