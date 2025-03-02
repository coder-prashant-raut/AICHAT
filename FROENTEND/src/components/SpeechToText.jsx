import { useState, useEffect } from "react";

const SpeechToText = ({ onTextRecognized }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;
    speechRecognition.lang = "hi-IN";

    speechRecognition.onstart = () => {
      setListening(true);
    };

    speechRecognition.onresult = (event) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript + " ";
        }
      }
      setTranscript((prev) => prev + newTranscript);
      onTextRecognized(newTranscript);
    };

    speechRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    speechRecognition.onend = () => {
      setListening(false);
    };

    setRecognition(speechRecognition);
  }, []);

  const startListening = () => {
    if (recognition && !listening) {
      setTranscript(""); // Clear previous transcript
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && listening) {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-lg">
      <button
        className={`p-4 rounded-full text-white shadow-md transition-all ${listening ? "bg-red-600" : "bg-green-600"}`}
        onClick={listening ? stopListening : startListening}
      >
        {listening ? "🛑 Stop" : "🎤 Speak"}
      </button>
      <div className="p-2 w-full text-center bg-gray-100 rounded-md min-h-[50px]">
        {transcript || "Start speaking..."}
      </div>
    </div>
  );
};

export default SpeechToText;
