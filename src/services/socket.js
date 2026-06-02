import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
  }
  return socket;
};

export const onTaskCreated = (callback) => {
  if (socket) socket.on('taskCreated', callback);
};

export const onTaskUpdated = (callback) => {
  if (socket) socket.on('taskUpdated', callback);
};

export const onTaskDeleted = (callback) => {
  if (socket) socket.on('taskDeleted', callback);
};

export const joinProject = (projectId) => {
  if (socket) socket.emit('joinProject', projectId);
};

export const emitTaskUpdate = (data) => {
  if (socket) socket.emit('taskUpdate', data);
};
