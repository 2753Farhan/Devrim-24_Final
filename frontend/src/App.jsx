import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TextEditor from './components/TextEditor';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Home route */}
                    <Route path="/create-story" element={<TextEditor />} /> {/* TextEditor route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
