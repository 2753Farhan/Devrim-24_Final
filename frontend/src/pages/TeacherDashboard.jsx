import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Context } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  BookOpen, 
  User, 
  Bell, 
  Search, 
  List,
  PlusCircle,
  BarChart3,
  Mic,
  BookOpenText,
  Settings,
  LogOut,
  Home
} from "lucide-react";

const bengaliLetters = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ'];

const FloatingLetter = ({ letter }) => {
  const randomDelay = Math.random() * 10;
  const randomDuration = 15 + Math.random() * 20;
  const startPosition = Math.random() * 100;

  return (
    <div
      className="absolute text-4xl text-blue-50/5 pointer-events-none select-none"
      style={{
        left: `${startPosition}vw`,
        animation: `floating ${randomDuration}s linear ${randomDelay}s infinite`,
        top: '-50px',
      }}
    >
      {letter}
    </div>
  );
};


const TeacherDashboard = () => {
  // States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Refs
  const quillRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  // Context and Navigation
  const { user } = useContext(Context);
  const navigate = useNavigate();
  
  // Initialize Quill and fetch stories
  useEffect(() => {
    if (!user || user.role !== "Teacher") {
      toast.error("Access denied. Teachers only!");
      navigate("/");
      return;
    }

    if (activeTab === 'create-story' && !quillRef.current) {
      const toolbarOptions = [
        // Text Formatting
        ['bold', 'italic', 'underline', 'strike'],
        
        // Headers
        [{ 'header': [1, 2, 3, false] }],
        
        // Text and Background Colors
        [{ 'color': [
          '', // Remove color
          '#000000', // Black
          '#e60000', // Red
          '#ff9900', // Orange
          '#ffff00', // Yellow
          '#008a00', // Green
          '#0066cc', // Blue
          '#9933ff', // Purple
          '#ffffff', // White
          '#facccc', // Light red
          '#ffebcc', // Light orange
          '#ffffcc', // Light yellow
          '#cce8cc', // Light green
          '#cce0f5', // Light blue
          '#ebd6ff'  // Light purple
        ] }],
        [{ 'background': [
          '', // Remove background
          '#000000', // Black
          '#e60000', // Red
          '#ff9900', // Orange
          '#ffff00', // Yellow
          '#008a00', // Green
          '#0066cc', // Blue
          '#9933ff', // Purple
          '#ffffff', // White
          '#facccc', // Light red
          '#ffebcc', // Light orange
          '#ffffcc', // Light yellow
          '#cce8cc', // Light green
          '#cce0f5', // Light blue
          '#ebd6ff'  // Light purple
        ] }],
        
        // Alignment
        [{ 'align': ['', 'center', 'right', 'justify'] }],
        
        // Media
        ['link', 'image'],
        
        // Clear Formatting
        ['clean']
      ];


      quillRef.current = new Quill('#editor', {
        theme: 'snow',
        modules: { toolbar: toolbarOptions },
        placeholder: 'Start writing your story...'
      });
    }

    fetchStories();
  }, [user, navigate, activeTab]);

  // Voice recording functions
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
          handleVoiceToText(audioBlob);
        };
      })
      .catch((err) => {
        toast.error("Error starting voice recording: " + err.message);
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceToText = async (audioBlob) => {
    if (!audioBlob) {
      toast.error("No audio recorded.");
      return;
    }
  
    const formData = new FormData();
    formData.append("audio", audioBlob);
  
    try {
      setLoading(true);
      // Get transcription from voice
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/voice`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
  
      // Convert transcription to Bangla
      const conversionResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/converter/convert`,
        { banglishText: response.data.transcription }
      );
  
      setTranscript(conversionResponse.data.banglaText);
      if (quillRef.current) {
        quillRef.current.root.innerHTML = conversionResponse.data.banglaText;
      }
      toast.success("Voice transcription and conversion successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to transcribe voice");
    } finally {
      setLoading(false);
    }
  };
  

  // API calls
  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/my-stories`,
        { withCredentials: true }
      );
      setStories(response.data.stories);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    const banglishContent = quillRef.current?.root.innerHTML || transcript;
    if (!banglishContent.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }
  
    try {
      setLoading(true);
      // First convert banglish to bangla
      const conversionResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/converter/convert`,
        { banglishText: banglishContent }
      );
      const banglaContent = conversionResponse.data.banglaText;
  
      // Generate title from bangla content
      const titleResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/generate-title`,
        { story: banglaContent }
      );
      const generatedTitle = titleResponse.data.title;
  
      // Save the story with bangla content
      const saveResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/add`,
        { title: generatedTitle, content: banglaContent },
        { withCredentials: true }
      );
  
      toast.success(saveResponse.data.message);
      setTitle("");
      quillRef.current.root.innerHTML = "";
      setTranscript("");
      fetchStories();
      setActiveTab('dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save story");
    } finally {
      setLoading(false);
    }
  };
  

  // Filter stories based on search
  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      {/* Animated Background */}
      {bengaliLetters.map((letter, index) => (
        <FloatingLetter key={index} letter={letter} />
      ))}

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              
              {/* Search */}
              <div className="relative">
                <div className={`transition-all duration-300 ease-in-out ${isSearchFocused ? 'w-96' : 'w-64'}`}>
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stories..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-2">
                {[
                  { name: 'Dashboard', icon: Home },
                  { name: 'Create Story', icon: PlusCircle },
                  { name: 'All Stories', icon: BookOpen },
                  { name: 'Analytics', icon: BarChart3 },
                  { name: 'Settings', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name.toLowerCase().replace(' ', '-'))}
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === item.name.toLowerCase().replace(' ', '-')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
                <button 
                  onClick={() => {
                    // Add logout logic here
                    navigate('/');
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Story Creation Form */}
            {activeTab === 'create-story' && (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Create New Story</h2>
      <div className="flex space-x-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
            ${isRecording ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
          `}
        >
          <Mic className="w-5 h-5" />
          <span>{isRecording ? 'Recording...' : 'Record Voice'}</span>
        </button>
        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <span>Stop Recording</span>
          </button>
        )}
      </div>
    </div>

    <form onSubmit={handleSaveStory}>
      <div id="editor" className="h-96 mb-6"></div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? (
            <span className="inline-block animate-spin">⌛</span>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              <span>Save Story</span>
            </>
          )}
        </button>
      </div>
    </form>
  </div>
)}

            {/* Stories List */}
            {activeTab === 'all-stories' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Stories</h2>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin text-4xl">⌛</div>
                  </div>
                ) : filteredStories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStories.map((story) => (
                      <div
                        key={story._id}
                        className="p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => setSelectedStory(story)}
                      >
                        <h3 className="font-medium text-gray-800">{story.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(story.createdAt).toLocaleDateString()}
                          </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {searchQuery ? 'No stories found matching your search' : 'No stories available'}
                  </p>
                )}
              </div>
            )}

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpenText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}</h2>
                      <p className="text-gray-600">Teacher Dashboard</p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Total Stories</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stories.length}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800">This Month</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {stories.filter(story => 
                        new Date(story.createdAt).getMonth() === new Date().getMonth()
                      ).length}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Latest Upload</h3>
                    <p className="text-lg font-medium text-blue-600 mt-2">
                      {stories.length > 0 
                        ? new Date(stories[0].createdAt).toLocaleDateString()
                        : 'No stories yet'
                      }
                    </p>
                  </div>
                </div>

                {/* Recent Stories */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Stories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stories.slice(0, 4).map((story) => (
                      <div
                        key={story._id}
                        className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => setSelectedStory(story)}
                      >
                        <h4 className="font-medium text-gray-800">{story.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics View */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h2>
                <div className="space-y-6">
                  {/* Story Upload Trends */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Trends</h3>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                      <p className="text-gray-500">Story upload analytics will be displayed here</p>
                    </div>
                  </div>

                  {/* Monthly Statistics */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Total Uploads</p>
                        <p className="text-2xl font-bold text-blue-600">{stories.length}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {stories.filter(story => 
                            new Date(story.createdAt).getMonth() === new Date().getMonth()
                          ).length}
                        </p>
                      </div>
                      {/* Add more stats as needed */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h3>
                    {/* Add profile settings form here */}
                    <p className="text-gray-500">Profile settings will be available soon</p>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                    {/* Add preferences settings here */}
                    <p className="text-gray-500">Preferences settings will be available soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Dialog */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedStory.title}</h3>
            <div
              className="prose prose-blue max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: selectedStory.content }}
            ></div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Created on: {new Date(selectedStory.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedStory(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx>{`
        @keyframes floating {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;