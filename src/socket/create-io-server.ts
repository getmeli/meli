import { Server } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { env } from '../env/env';
import { Server as HttpServer } from 'http';

export const Io: { server?: Server } = {};

export function createIoServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    /*
     * https://github.com/socketio/socket.io/issues/3259#issuecomment-448058937
     * https://github.com/socketio/socket.io/issues/3259#issuecomment-474523271
     */
    pingTimeout: 60000,
    allowEIO3: true,
    cors: {
      origin: env.MELI_UI_URL,
      // methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  if (env.MELI_REDIS_URL) {
    io.adapter(createAdapter(env.MELI_REDIS_URL));
  }

  Io.server = io;

  return io;
}
