<<<<<<< Updated upstream
const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.io server\n');
});

const io = new Server(server);

let documentContent = 'This is a collaborative document.';
let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('load-document', documentContent); // Send current document to the new user

  socket.on('text-change', (newContent) => {
    documentContent = newContent;
    socket.broadcast.emit('text-change', newContent); // Broadcast to other users
  });

  socket.on('new-user', (username) => {
    users[socket.id] = username;
    io.emit('update-users', Object.values(users)); // Update user list for all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('update-users', Object.values(users)); // Update user list for all
  });
});

// Export handler for the Netlify Function
exports.handler = (event, context) => {
  server.emit('request', event, context);
};
=======
const { Server } = require('socket.io');

let documentContent = 'This is a collaborative document.';
let users = {}; // Store users with their socket IDs and usernames

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Handle new user joining with username
      socket.on('new-user', (username) => {
        users[socket.id] = username;
        io.emit('update-users', Object.values(users));
      });

      // Load document content for new users
      socket.emit('load-document', documentContent);

      // Handle text changes
      socket.on('text-change', (newContent) => {
        documentContent = newContent;
        socket.broadcast.emit('text-change', newContent);
      });

      // Handle user disconnect
      socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('update-users', Object.values(users));
      });
    });
  }
  res.end();
};

export default ioHandler;
>>>>>>> Stashed changes
