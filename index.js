const { Server } = require('socket.io');

let ioInstance = null;

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    socket.on('leaveProject', (projectId) => {
      socket.leave(projectId);
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  ioInstance = io;
};

const getIO = () => ioInstance;

module.exports = setupSocket;
module.exports.getIO = getIO;
