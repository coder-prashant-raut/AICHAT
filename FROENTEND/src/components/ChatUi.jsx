import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;



const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

console.log("API Key:", apiKey)


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
         
            "Authorization": `Bearer ${apiKey}`,

          "HTTP-Referer": "https://marathibatmya.in/",
          "X-Title": "Prashant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
          "messages": [
            { role: "system", content: "Think internally, but only output the final choice as the response." },
            ...updatedMessages.map((msg) => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text }))
          ]
        })
      });

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || "I'm not sure how to respond.";

      // Remove internal AI "thinking" parts
      aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

      const aiMessage = { text: aiResponse, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { text: "⚠️ Error fetching response. Try again!", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white w-full max-w-4xl mx-auto px-4 md:px-8  ">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-xl font-semibold text-center scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800   ">💬 AI Chat</div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4  chat-container">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-600 w-2/5 ml-auto text-right" : "bg-gray-800 w-4/5 text-left"}`}
          >
            {msg.text}
          </motion.div>
        ))}
        
        {/* Typing Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="p-3 bg-gray-700 max-w-xs rounded-lg text-white"
          >
            ⏳ Typing...
          </motion.div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-800 flex">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 p-3 rounded-r-lg text-white font-semibold disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
