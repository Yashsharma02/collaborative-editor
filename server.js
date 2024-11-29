const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all domains to connect
    methods: ['GET', 'POST']
  },
});

let documentContent = 'This is a collaborative document.';
let users = {};  // Store users' socket IDs and their usernames

app.use(express.static('public'));

// Handle new user connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle new user with their username
  socket.on('new-user', (username) => {
    users[socket.id] = username;
    io.emit('update-users', Object.values(users));  // Broadcast updated user list
  });

  // Send current document content to the new user
  socket.emit('load-document', documentContent);

  // Listen for text changes from clients
  socket.on('text-change', (newContent) => {
    documentContent = newContent;  // Update content on the server
    socket.broadcast.emit('text-change', newContent);  // Broadcast change to all other users
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];  // Remove user from the list
    io.emit('update-users', Object.values(users));  // Broadcast updated user list
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
