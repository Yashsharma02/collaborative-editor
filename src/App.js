import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(); // Assuming it's connecting to the Netlify function

function App() {
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('load-document', (initialContent) => {
      setContent(initialContent);
    });

    socket.on('text-change', (newContent) => {
      setContent(newContent);
    });

    socket.on('update-users', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('load-document');
      socket.off('text-change');
      socket.off('update-users');
    };
  }, []);

  const handleChange = (e) => {
    setContent(e.target.value);
    socket.emit('text-change', e.target.value);
  };

  const handleUsername = () => {
    if (username) {
      socket.emit('new-user', username); // Emit the username to the server
    } else {
      alert("Please enter a valid username.");
    }
  };

  return (
    <div className="App">
      <h1>Collaborative Text Editor</h1>

      {/* Input field to set username */}
      {!username ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleUsername}>Set Username</button>
        </div>
      ) : (
        <p>Welcome, {username}</p>
      )}

      {/* Textarea for collaborative writing */}
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Start typing..."
        rows="20"
        cols="50"
      />

      <h3>Active Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
