import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TextEditor from './components/TextEditor';

function App() {
    return (
        <div>
            <Navbar />
            <Home />
            <TextEditor />
        </div>
    );
}

export default App;
