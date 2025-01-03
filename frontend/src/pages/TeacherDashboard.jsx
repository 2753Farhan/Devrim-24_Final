import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles

const TeacherDashboard = () => {
  const [title, setTitle] = useState("");
  const [stories, setStories] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const quillRef = useRef(null); // Ref for Quill editor
  const mediaRecorderRef = useRef(null); // Ref for media recorder

  // Fetch teacher's stories
  const fetchStories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/my-stories`,
        { withCredentials: true }
      );
      setStories(data.stories);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stories");
    }
  };

  // Handle story submission (from Quill editor or voice-to-text)
  const handleSaveStory = async (e) => {
    e.preventDefault();
    const banglishContent = quillRef.current?.root.innerHTML || transcript; // Use Quill content or transcript from voice
  
    if (!banglishContent.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }
  
    try {
      // Step 1: Convert Banglish content to Bangla
      const conversionResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/converter/convert`,
        { banglishText: banglishContent }
      );
      const banglaContent = conversionResponse.data.banglaText;
  
      // Step 2: Generate title from the Bangla content
      const titleResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/generate-title`,
        { story: banglaContent }
      );
      const generatedTitle = titleResponse.data.title;
  
      // Step 3: Save the Bangla content and generated title to the database
      const saveResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/add`,
        { title: generatedTitle, content: banglaContent },
        { withCredentials: true }
      );
  
      toast.success(saveResponse.data.message);
      setTitle("");
      quillRef.current.root.innerHTML = ""; // Clear the editor
      setTranscript(""); // Clear transcript
      fetchStories(); // Refresh the stories list
    } catch (error) {
      console.error("Error processing and saving story:", error);
      toast.error(error.response?.data?.message || "Failed to process and save story");
    }
  };
    // Handle voice recording
  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorderRef.current = mediaRecorder;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          setAudioBlob(audioBlob);
          setIsRecording(false);
          handleVoiceToText(audioBlob); // Process the voice input after stopping
        };
      })
      .catch((err) => {
        toast.error("Error starting voice recording: " + err.message);
      });
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Convert audio to text using backend API
  const handleVoiceToText = async (audioBlob) => {
    if (!audioBlob) {
      toast.error("No audio recorded.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/voice`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );

      // Log the full response for debugging
      console.log("Voice transcription response:", data);

      setTranscript(data.transcription); // Set the transcription text
      quillRef.current.root.innerHTML = data.transcription; // Populate the editor with transcribed text
      toast.success("Voice transcription successful!");
      fetchStories(); // Refresh the stories list
    } catch (error) {
      console.error("Error transcribing voice:", error);
      toast.error(error.response?.data?.message || "Failed to transcribe voice");
    }
  };

  useEffect(() => {
    // Initialize Quill editor
    if (!quillRef.current) {
      const Font = Quill.import("formats/font");
      Font.whitelist = [
        "arial",
        "times-new-roman",
        "courier",
        "monospace",
        "verdana",
      ];
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

    // Fetch stories when component mounts
    fetchStories();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Teacher Dashboard</h1>

      {/* Story Writing Section */}
      <form onSubmit={handleSaveStory} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Write a Story</h2>

        {/* Quill Editor for rich text input */}
        <div
          id="editor"
          className="border p-2 rounded mb-4"
          style={{ height: "300px" }}
        ></div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Story
        </button>
      </form>

      {/* Voice Recording Section */}
      <div className="mb-8">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white p-2 rounded mr-4"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white p-2 rounded mr-4"
          >
            Stop Recording
          </button>
        )}
      </div>

      {/* Display Uploaded Stories */}
      <h2 className="text-2xl font-bold mb-4">Your Stories</h2>
      {stories.length > 0 ? (
        <ul className="space-y-4">
          {stories.map((story) => (
            <li key={story._id} className="border p-4 rounded">
              <h3 className="text-xl font-bold">{story.title}</h3>
              <div
                className="text-gray-700 mt-2"
                dangerouslySetInnerHTML={{ __html: story.content }}
              ></div>
              <p className="text-sm text-gray-500 mt-2">
                Created At: {new Date(story.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No stories uploaded yet.</p>
      )}
    </div>
  );
};

export default TeacherDashboard;
