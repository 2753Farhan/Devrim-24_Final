import React, { useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TextEditor = () => {
    const quillRef = useRef(null);

    const handleSave = async () => {
        const content = quillRef.current?.root.innerHTML || '';
        if (!content.trim()) {
          alert('Content cannot be empty.');
          return;
        }
      
        try {
          const response = await fetch('http://localhost:5000/api/editor/stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          });
      
          if (response.ok) {
            const data = await response.json();
            alert('Story saved successfully!');
            console.log("Saved story:", data);
            if (quillRef.current) quillRef.current.root.innerHTML = '';
          } else {
            const errorData = await response.json();
            alert(`Failed to save story: ${errorData.error || 'Unknown error'}`);
          }
        } catch (error) {
          console.error("Error:", error);
          alert('An error occurred while saving the story.');
        }
      };      

    React.useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill('#editor', {
                theme: 'snow',
            });
        }
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create Your Story</h2>
            <div id="editor" style={{ height: '300px', marginBottom: '20px' }}></div>
            <button
                onClick={handleSave}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                Save Story
            </button>
        </div>
    );
};

export default TextEditor;
