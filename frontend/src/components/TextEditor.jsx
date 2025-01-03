import React, { useRef, useEffect } from 'react';
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
        alert('Story saved successfully!');
        if (quillRef.current) quillRef.current.root.innerHTML = '';
      } else {
        alert('Failed to save story.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the story.');
    }
  };

  useEffect(() => {
    if (!quillRef.current) {
      // Add custom fonts
      const Font = Quill.import('formats/font');
      Font.whitelist = ['arial', 'times-new-roman', 'courier', 'monospace', 'verdana'];
      Quill.register(Font, true);

      const toolbarOptions = [
        [{ font: [] }], // Font styles dropdown
        [{ header: [1, 2, 3, false] }], // Heading sizes
        ['bold', 'italic', 'underline'], // Text styling
        [{ color: [] }], // Color dropdown
        ['link', 'image'], // Links and images
        [{ align: [] }], // Text alignment
        ['clean'], // Remove formatting
      ];

      quillRef.current = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
        },
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
