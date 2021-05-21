import { Socket } from 'socket.io';
import { Logger } from '../commons/logger/logger';
import { User } from '../entities/users/user';
import { canAdminRelease } from '../entities/releases/guards/can-admin-release';
import { getUserFromSocket } from '../auth/utils/get-user-from-socket';
import { canReadProject } from '../entities/projects/guards/can-read-project';
import { isOrgMember } from '../entities/orgs/guards/is-org-member';
import { canAdminSite } from '../entities/sites/guards/can-admin-site';
import { Io } from './create-io-server';

const logger = new Logger('meli.api:socket');

function createRoom(
  socket: Socket,
  room: string,
  checkAccess: (user: User, entityId: any) => Promise<boolean> | boolean,
) {
  socket.on(`join.${room}`, async entityId => {
    if (!entityId) {
      logger.debug('entityId empty, returning');
      socket.emit('error', {
        context: `join.${room}`,
        message: 'No entity id provided',
      });
      return;
    }

    logger.debug(socket.id, 'asking to join room', room);

    let user: User;
    try {
      user = await getUserFromSocket(socket);
    } catch (e) {
      logger.error(e);
      socket.emit('error', {
        context: `join.${room}`,
        message: 'Could not get user from socket',
      });
      return;
    }

    if (!user) {
      logger.debug('no user found in socket, not joining room', room);
      socket.emit('error', {
        context: `join.${room}`,
        message: 'Socket not authenticated',
      });
      return;
    }

    let canJoin: boolean;
    try {
      canJoin = await checkAccess(user, entityId);
    } catch (e) {
      logger.error(e);
      socket.emit('error', {
        context: `join.${room}`,
        message: 'Could not check if you could join room',
      });
      return;
    }

    if (canJoin) {
      socket.join(`${room}.${entityId}`);
      logger.debug(user.name, 'joined room', room);
    } else {
      logger.debug(user.name, 'not allowed to join room', room);
      socket.emit('error', {
        context: `join.${room}`,
        message: 'Not allowed to join room',
      });
    }
  });

  socket.on(`leave.${room}`, entityId => {
    if (!entityId) {
      logger.debug('entityId empty, cannot determine room to leave, returning');
      socket.emit('error', {
        context: `leave.${room}`,
        message: 'No entity id provided',
      });
      return;
    }
    socket.leave(`${room}.${entityId}`);
  });
}

export function initSocketRooms() {
  Io.server.on('connection', socket => {
    logger.debug('socket connected', socket.id);

    createRoom(socket, 'user', (user, userId) => user._id === userId);
    createRoom(socket, 'site', (user, siteId) => canAdminSite(siteId, user._id));
    createRoom(socket, 'release', (user, releaseId) => canAdminRelease(releaseId, user._id));
    createRoom(socket, 'project', (user, projectId) => canReadProject(projectId, user._id));
    createRoom(socket, 'org', (user, orgId) => isOrgMember(user._id, orgId));
  });
}
