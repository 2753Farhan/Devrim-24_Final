import React, { useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TextEditor = () => {
  const quillRef = useRef(null);
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    const content = (quillRef.current && quillRef.current.root)
      ? quillRef.current.root.innerHTML
      : '';
    if (!title || !content) {
      alert('Please provide a title and content.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/editor/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
  
      if (response.ok) {
        alert('Story saved successfully!');
        setTitle('');
        if (quillRef.current && quillRef.current.root) {
          quillRef.current.root.innerHTML = ''; // Clear the editor
        }
      } else {
        alert('Failed to save story.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
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
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
      />
      <div id="editor" style={{ height: '300px', marginBottom: '10px' }}></div>
      <button onClick={handleSave} style={{ padding: '10px', fontSize: '16px' }}>
        Save Story
      </button>
    </div>
  );
};

export default TextEditor;
