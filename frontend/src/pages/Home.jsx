import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleCreateStory = () => {
        navigate('/create-story'); // Navigate to the TextEditor route
    };

    return (
        <div>
            <h2>Welcome to the Banglish to Bangla Converter App</h2>
            <p>Start translating your text seamlessly.</p>
            <button
                onClick={handleCreateStory}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: '20px',
                }}
            >
                Create Story
            </button>
        </div>
    );
}

export default Home;
