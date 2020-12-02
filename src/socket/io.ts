import socketIo, { Server } from 'socket.io';
import redisAdapter from 'socket.io-redis';
import { env } from '../env';

export const io: Server = socketIo({
  /*
   * https://github.com/socketio/socket.io/issues/3259#issuecomment-448058937
   * https://github.com/socketio/socket.io/issues/3259#issuecomment-474523271
   */
  pingTimeout: 60000,
});

if (env.MELI_REDIS_URL) {
  io.adapter(redisAdapter(env.MELI_REDIS_URL));
}
