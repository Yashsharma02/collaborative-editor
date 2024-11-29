import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io();

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Listen for active users update
    socket.on('update-users', (userList) => {
      setUsers(userList);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('update-users');
    };
  }, []);

  return (
    <div id="user-list">
      <h2>Active Users:</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
