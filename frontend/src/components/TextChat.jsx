import React, { useState } from "react";
import axios from "axios";

const TextChat = () => {
  const [textInput, setTextInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/chat/text", {
        notesId: "6777c5731fb3d715a1c95418",
        query: `Just Convert the Banglish (a mixture of Bengali language written in the English alphabet) to Bangla without any extra words: ${textInput}`,
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
        <h1 className="text-xl font-semibold text-center mb-4">Text Chat</h1>
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 mb-4"
          placeholder="Type your question here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <button
          onClick={handleTextSubmit}
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
        >
          {loading ? "Processing..." : "Send Text"}
        </button>
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

export default TextChat;
