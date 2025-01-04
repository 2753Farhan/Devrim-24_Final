import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Custom image upload handler
const imageHandler = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      try {
        // Create a FormData instance
        const formData = new FormData();
        formData.append('image', file);

        // Upload to your server
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload-image`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          const quill = Quill.find(document.getElementById('editor'));
          const range = quill.getSelection(true);
          
          // Insert the uploaded image
          quill.insertEmbed(range.index, 'image', data.imageUrl);
        } else {
          alert('Failed to upload image.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image.');
      }
    }
  };
};

// Custom link handler
const linkHandler = () => {
  const quill = Quill.find(document.getElementById('editor'));
  const range = quill.getSelection();
  
  if (range) {
    const url = prompt('Enter URL:');
    if (url) {
      quill.format('link', url);
    }
  }
};

const TextEditor = ({ onStorySaved }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [content, setContent] = useState('');

  const handleSave = async () => {
    const content = quillRef.current?.root.innerHTML || "";
    if (!content.trim()) {
      alert("Content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/story/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        alert("Story saved successfully!");
        if (quillRef.current) quillRef.current.root.innerHTML = "";
        if (onStorySaved) onStorySaved();
      } else {
        alert("Failed to save story.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the story.");
    }
  };

  useEffect(() => {
    if (!quillRef.current) {
      // Register custom fonts
      const Font = Quill.import("formats/font");
      Font.whitelist = ["arial", "times-new-roman", "courier", "monospace", "verdana"];
      Quill.register(Font, true);

      // Define toolbar options with enhanced features
      const toolbarOptions = [
        // Basic Formatting
        ['bold', 'italic', 'underline', 'strike'],
        
        // Font and Size
        [{ 'font': Font.whitelist }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        
        // Headers
        [{ 'header': [1, 2, 3, false] }],
        
        // Text Colors with Extended Palette
        [{ 'color': [
          '', // Default - removes color
          '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
          '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
          '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
          '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd'
        ] }],
        [{ 'background': [
          '', // Default - removes background
          '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
          '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
          '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
          '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd'
        ] }],
        
        // Alignment and Lists
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        
        // Media and Special Formatting
        ['link', 'image'],
        ['blockquote', 'code-block'],
        
        // Clear Formatting
        ['clean']
      ];

      // Initialize Quill with custom handlers
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler,
              link: linkHandler
            }
          }
        },
        placeholder: 'Start writing your story...'
      });

      // Add change handler
      quillRef.current.on('text-change', () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Create New Story</h2>
      <div className="flex flex-col gap-4">
        <div 
          ref={editorRef} 
          id="editor"
          className="border rounded-lg"
          style={{ minHeight: "400px" }}
        ></div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;