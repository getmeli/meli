import { Socket } from 'socket.io';
import { verifyToken } from './verify-token';
import { authCookieName } from '../auth';
import cookie from 'cookie';
import { User } from '../../entities/users/user';

export async function getUserFromSocket(socket: Socket): Promise<User> {
  const cookies = cookie.parse(socket.handshake.headers.cookie || '');
  const token = cookies[authCookieName];
  return verifyToken(token);
}
