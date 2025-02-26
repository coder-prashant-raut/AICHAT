import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WebsiteDownPage() {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white text-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('https://source.unsplash.com/random/800x600?technology')] bg-cover bg-center opacity-10"
      ></motion.div>
      
      <motion.img
        src="https://avatars.githubusercontent.com/u/162595999?s=400"
        alt="Avatar"
        className="w-20 h-20 rounded-full border-4 border-white shadow-lg z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-8xl drop-shadow-lg mt-4 z-10"
      >
        🤖💤
      </motion.div>
      
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-4xl font-extrabold mt-4 text-gray-300 z-10"
      >
        Prashant is Dreaming in Code {dots}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-lg mt-3 text-gray-400 max-w-md z-10"
      >
        Our AI assistant, Prashant, has entered deep hibernation mode. 🤯⚡ He is currently processing advanced neural calculations. He will wake up soon, wiser and sharper! Stay tuned. 🚀
      </motion.p>
      
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="text-5xl mt-8 text-gray-500 z-10"
      >
        ⏳
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="text-sm text-gray-500 mt-4 z-10"
      >
        Meanwhile, grab a Tea ☕ and enjoy the silence of the digital void.
      </motion.p>
      
    </div>
  );
}