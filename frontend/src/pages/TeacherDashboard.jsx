import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles

const TeacherDashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [stories, setStories] = useState([]);

  const quillRef = useRef(null); // Ref for Quill editor

  // Fetch teacher's stories
  const fetchStories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/story/my-stories`, {
        withCredentials: true,
      });
      setStories(data.stories);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stories");
    }
  };

  // Handle adding a new story
  const handleAddStory = async (e) => {
    e.preventDefault();

    // Get the content from Quill editor
    const storyContent = quillRef.current?.root.innerHTML || "";

    if (!storyContent.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/add`,
        { title, content: storyContent },
        { withCredentials: true }
      );
      toast.success(data.message);
      setTitle("");
      quillRef.current.root.innerHTML = ""; // Clear the editor
      fetchStories(); // Refresh the stories list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add story");
    }
  };

  useEffect(() => {
    // Initialize Quill editor
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

    // Fetch stories when component mounts
    fetchStories();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Teacher Dashboard</h1>
      {/* Story Writing Section */}
      <form onSubmit={handleAddStory} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Write a Story</h2>
        <input
          type="text"
          placeholder="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Quill Editor for rich text input */}
        <div
          id="editor"
          className="border p-2 rounded mb-4"
          style={{ height: "300px" }}
        ></div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Submit Story
        </button>
      </form>

      {/* Story List */}
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
