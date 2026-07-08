import { Server } from 'socket.io';

import { getAllowedOrigins } from '../utils/env.js';

export const initializeSockets = (httpServer, app) => {
  const allowedOrigins = getAllowedOrigins();

  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      },
      credentials: false,
    },
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });

  app.set('io', io);
  return io;
};
