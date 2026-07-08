import 'dotenv/config';
import http from 'http';

import app from './app.js';
import { connectDB } from './config/db.js';
import { initializeSockets } from './sockets/index.js';
import { getPort } from './utils/env.js';

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = initializeSockets(server, app);
  app.set('io', io);

  const port = getPort();

  server.listen(port, () => {
    console.log(`NexTerra backend running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});
