
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

let adminSocket = null;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register-admin', (password) => {
    if (password === 'admin') {
      adminSocket = socket;
      console.log('Admin registered');
    }
  });

  socket.on('user-message', (data) => {
    if (adminSocket) {
      adminSocket.emit('user-message', data);
    }
  });

  socket.on('admin-reply', (data) => {
    io.emit('admin-reply', data);
  });

  socket.on('disconnect', () => {
    if (socket === adminSocket) {
      adminSocket = null;
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Livechat server running on port ${PORT}`);
});

