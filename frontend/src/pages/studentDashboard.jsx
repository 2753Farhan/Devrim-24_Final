import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [stories, setStories] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [loadingPdfs, setLoadingPdfs] = useState(false);
  const [exportingStoryId, setExportingStoryId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState({});
  const [chatStoryId, setChatStoryId] = useState(null); // Story ID for chat
  const [query, setQuery] = useState(""); // User's query
  const [chatResponse, setChatResponse] = useState(""); // Chatbot response
  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // Chat modal visibility

  // Fetch all stories
  const fetchStories = async () => {
    try {
      setLoadingStories(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/stories`
      );
      setStories(data.stories);
    } catch (error) {
      setErrorMessage("Failed to fetch stories. Please try again later.");
      console.error("Error fetching stories:", error);
    } finally {
      setLoadingStories(false);
    }
  };

  // Fetch user PDFs
  const fetchPdfs = async () => {
    try {
      setLoadingPdfs(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/my-pdfs`,
        { withCredentials: true }
      );
      setPdfs(data.pdfs);
    } catch (error) {
      setErrorMessage("Failed to fetch your PDFs. Please try again later.");
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoadingPdfs(false);
    }
  };

  // Export a story as a PDF
  const handleExportPdf = async (storyId) => {
    const visibility = selectedVisibility[storyId];
    if (!visibility) {
      setErrorMessage("Please select a visibility option.");
      return;
    }

    try {
      setExportingStoryId(storyId);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/export`,
        { storyId, visibility },
        { withCredentials: true }
      );

      setSuccessMessage("Story exported successfully!");
      console.log("Exported PDF:", data.pdf);

      setTimeout(() => setSuccessMessage(""), 3000);
      fetchPdfs(); // Refresh PDFs list
    } catch (error) {
      setErrorMessage("Failed to export story as PDF. Please try again.");
      console.error("Error exporting story as PDF:", error);
    } finally {
      setExportingStoryId(null);
    }
  };

  // Chat with the selected story
  const handleChatWithStory = async () => {
    if (!query.trim()) {
      setErrorMessage("Please enter a valid query.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/query-story`,
        { storyId: chatStoryId, query }
      );

      setChatResponse(data.response);
    } catch (error) {
      setErrorMessage("Failed to fetch chat response. Please try again.");
      console.error("Error in chatbot interaction:", error);
    }
  };

  useEffect(() => {
    fetchStories();
    fetchPdfs();
  }, []);

  const handleVisibilityChange = (storyId, value) => {
    setSelectedVisibility((prev) => ({
      ...prev,
      [storyId]: value,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Stories Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loadingStories ? (
            <p>Loading stories...</p>
          ) : stories.length === 0 ? (
            <p>No stories available.</p>
          ) : (
            stories.map((story) => (
              <div
                key={story._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {story.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {story.content}
                </p>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-3"
                  value={selectedVisibility[story._id] || ""}
                  onChange={(e) =>
                    handleVisibilityChange(story._id, e.target.value)
                  }
                >
                  <option value="">Select Visibility</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
                <button
                  onClick={() => handleExportPdf(story._id)}
                  disabled={
                    exportingStoryId === story._id ||
                    !selectedVisibility[story._id]
                  }
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportingStoryId === story._id ? "Exporting..." : "Export PDF"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* PDFs Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My PDFs</h2>
          {loadingPdfs ? (
            <p>Loading PDFs...</p>
          ) : pdfs.length === 0 ? (
            <p>You haven't exported any PDFs yet.</p>
          ) : (
            pdfs.map((pdf) => (
              <div
                key={pdf._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {pdf.story.title}
                  </h3>
                  <p>
                    <a
                      href={pdf.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View PDF
                    </a>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setChatStoryId(pdf.story._id);
                    setIsChatModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Chat with Story
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
            <h2 className="text-xl font-bold mb-4">Chat with Story</h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows="4"
              placeholder="Enter your query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></textarea>
            <div className="flex justify-between">
              <button
                onClick={handleChatWithStory}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setIsChatModalOpen(false);
                  setQuery("");
                  setChatResponse("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
            {chatResponse && (
              <div className="mt-4 bg-green-100 p-4 rounded">
                <p className="text-green-800">{chatResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
