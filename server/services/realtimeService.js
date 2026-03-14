import { Server } from 'socket.io';

let io;

export const initRealtime = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL?.split(',') || '*',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.emit('system:welcome', {
      message: 'Connected to HelpHive realtime channel',
    });
  });

  return io;
};

export const emitRealtime = (eventName, payload) => {
  if (!io) return;
  io.emit(eventName, payload);
};
