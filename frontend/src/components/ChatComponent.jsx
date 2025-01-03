import React, { useState } from "react";
import axios from "axios";
import { FiSend, FiMic } from "react-icons/fi";

const ChatComponent = () => {
  const [textInput, setTextInput] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/text", {
        notesId: "sampleNoteId", // Replace with dynamic ID if needed
        query: textInput,
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSubmit = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append("audio", audioFile);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/voice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold text-center mb-4">Chat with AI</h1>
        
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 mb-4"
          placeholder="Type your question here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <button
          onClick={handleTextSubmit}
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 flex items-center justify-center"
        >
          {loading ? "Processing..." : <><FiSend className="mr-2" /> Send Text</>}
        </button>

        <div className="flex items-center justify-between my-4">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            className="w-3/4"
          />
          <button
            onClick={handleVoiceSubmit}
            className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600"
          >
            {loading ? "..." : <FiMic />}
          </button>
        </div>

        {response && (
          <div className="mt-4 bg-gray-100 p-4 rounded-md">
            <h2 className="font-semibold mb-2">Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
