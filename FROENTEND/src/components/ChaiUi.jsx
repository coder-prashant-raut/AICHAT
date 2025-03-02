import { useState, useRef, useEffect } from "react";
import { MdSend, MdVideoCall, MdCall } from "react-icons/md";
import SpeechToText from "./SpeechToText"; // Import the SpeechToText component
import { motion } from "framer-motion";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

const themes = {
  blue: { bg: "bg-blue-200", text: "text-gray-900", primary: "bg-blue-500", input: "border-blue-300" },
  green: { bg: "bg-green-200", text: "text-gray-900", primary: "bg-green-500", input: "border-green-300" },
  purple: { bg: "bg-purple-200", text: "text-gray-900", primary: "bg-purple-500", input: "border-purple-300" },
  red: { bg: "bg-red-200", text: "text-gray-900", primary: "bg-red-500", input: "border-red-300" },
  dark: { bg: "bg-gray-900", text: "text-white", primary: "bg-gray-700", input: "border-gray-600" },
};

export default function ChaiUi() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
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
    setTyping(true);

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
      setTyping(false);
    }
  };

  const handleSpeechResult = (transcript) => {
    setInput(transcript);
    sendMessage(); // Automatically send the message after speech input
  };

  return (
    <div className={`flex flex-col w-screen h-screen  ${themes[theme].bg} ${themes[theme].text}`}>
      <header className={`fixed top-0 w-full p-4 shadow-md flex justify-between items-center ${themes[theme].primary} text-white`}>
        <div className="flex items-center">
          <img src="https://avatars.githubusercontent.com/u/162595999?s=400" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white" />
          <span className="ml-3 font-semibold">Prashant Raut</span>
        </div>
        <div className="flex space-x-2">
          {Object.keys(themes).map((t) => (
            <div key={t} className={`w-6 h-6 rounded-full cursor-pointer ${themes[t].primary} border-2 border-white ${theme === t ? "scale-110 border-gray-200" : ""}`} onClick={() => setTheme(t)}></div>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto mt-16 mb-16 p-4 space-y-4 pt-20">
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {messages.map(({ text, sender, timestamp }, index) => (
          <div key={index} className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-2xl shadow-md text-sm max-w-xs ${themes[theme].bg} ${themes[theme].text}`}>
              <p>{text}</p>
              <small className="block text-right text-xs text-gray-700 mt-1">{timestamp}</small>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-2xl shadow-md text-sm max-w-xs ${themes[theme].bg} ${themes[theme].text}`}>
              <p className="animate-pulse">Typing...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* <div className={`fixed bottom-0 w-full p-3 px-4 flex items-center bg-white border-t  ${themes[theme].input}`}>
        <input type="text" className="flex-1 p-3 rounded-full border outline-none shadow-sm" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
        <button className={`ml-2 p-3 rounded-full text-white shadow-lg ${themes[theme].primary}`} onClick={sendMessage} disabled={loading}>
          <MdSend size={20} />
        </button>
      </div> */}

<div className={`fixed bottom-0 w-full px-4 py-2 flex items-center bg-white border-t ${themes[theme].input}`}>
  <input 
    type="text" 
    className="flex-grow min-w-0 p-2 rounded-full border outline-none shadow-sm" 
    placeholder="Type a message..." 
    value={input} 
    onChange={(e) => setInput(e.target.value)} 
    onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
  />

<SpeechToText onSpeechResult={handleSpeechResult} /> {/* Add SpeechToText component */}
  <button 
    className={`ml-2 p-2 sm:p-1 rounded-full text-white shadow-md ${themes[theme].primary}`} 
    onClick={sendMessage} 
    disabled={loading}
  >
    <MdSend size={20} />
  </button>
</div>

    </div>
  );
}
