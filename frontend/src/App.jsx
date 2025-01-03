import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import TextChat from "./components/TextChat";
import VoiceChat from "./components/VoiceChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text-chat" element={<TextChat />} />
        <Route path="/voice-chat" element={<VoiceChat />} />
      </Routes>
    </Router>
  );
}

export default App;
