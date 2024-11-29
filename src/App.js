import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const App = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');  // Connect to the server
    setSocket(socket);

    // Listen for user list updates
    socket.on('update-users', (userList) => {
      setUsers(userList);
    });

    // Load the document content when a user connects
    socket.on('load-document', (content) => {
      setContent(content);
    });

    // Listen for content changes from other users
    socket.on('text-change', (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = () => {
    if (username.trim() !== '') {
      setIsLoggedIn(true);
      socket.emit('new-user', username);  // Send username to server
    }
  };

  const handleContentChange = (event) => {
    const newContent = event.target.value;
    setContent(newContent);  // Immediately update local content
    socket.emit('text-change', newContent);  // Send content change to server
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Join</button>
        </div>
      ) : (
        <div>
          <h1>Collaborative Editor</h1>
          <textarea
            value={content}
            onChange={handleContentChange}
            rows="10"
            cols="50"
          />
          <div>
            <h3>Active Users</h3>
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user}</li>  // Display the list of users
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
