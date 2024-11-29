import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io();

const Editor = () => {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Listen for document content on load
    socket.on('load-document', (initialContent) => {
      setContent(initialContent);
    });

    // Listen for text changes from other users
    socket.on('text-change', (newContent) => {
      if (!isTyping) {
        setContent(newContent);
      }
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('load-document');
      socket.off('text-change');
    };
  }, [isTyping]);

  // Handle content change
  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsTyping(true);
    socket.emit('text-change', newContent);
  };

  const handleSave = () => {
    socket.emit('save-text', content);
    alert('Text saved successfully!');
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={handleChange}
        rows="20"
        cols="80"
      />
      <button onClick={handleSave}>Save Text</button>
    </div>
  );
};

export default Editor;
