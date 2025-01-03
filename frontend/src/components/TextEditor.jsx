import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TextEditor = ({ onStorySaved }) => {
  const quillRef = useRef(null);

  const handleSave = async () => {
    const content = quillRef.current?.root.innerHTML || "";
    if (!content.trim()) {
      alert("Content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/story/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        alert("Story saved successfully!");
        if (quillRef.current) quillRef.current.root.innerHTML = "";
        if (onStorySaved) onStorySaved(); // Notify parent component
      } else {
        alert("Failed to save story.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the story.");
    }
  };

  useEffect(() => {
    if (!quillRef.current) {
      const Font = Quill.import("formats/font");
      Font.whitelist = ["arial", "times-new-roman", "courier", "monospace", "verdana"];
      Quill.register(Font, true);

      const toolbarOptions = [
        [{ font: [] }],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ color: [] }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
      ];

      quillRef.current = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });
    }
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Write Your Story</h2>
      <div id="editor" className="border p-2 rounded" style={{ height: "300px", marginBottom: "20px" }}></div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Story
      </button>
    </div>
  );
};

export default TextEditor;
