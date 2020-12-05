import { Socket } from 'socket.io';
import chalk from 'chalk';
import { io } from './io';
import { Logger } from '../commons/logger/logger';
import { User, userSocketRoom } from '../entities/users/user';
import { siteSocketRoom } from '../entities/sites/site';
import { releaseSocketRoom } from '../entities/releases/release';
import { canAdminRelease } from '../entities/releases/guards/can-admin-release';
import { getUserFromSocket } from '../auth/utils/get-user-from-socket';
import { teamSocketRoom } from '../entities/teams/team';
import { canReadTeam } from '../entities/teams/guards/can-read-team';
import { orgSocketRoom } from '../entities/orgs/org';
import { isOrgMember } from '../entities/orgs/guards/is-org-member';
import { canAdminSite } from '../entities/sites/guards/can-admin-site';

const logger = new Logger('meli.api:rooms');

function joinRoom(
  socket: Socket,
  docId: string,
  getRoom: (docId: string) => string,
  checkAccess: (user: User) => Promise<boolean> | boolean,
) {
  if (!docId) {
    logger.debug(`Id "${chalk.blue(docId)}" is empty or not en object id`);
    return;
  }

  const room = getRoom(docId);
  logger.debug(`${chalk.bold(socket.id)} asking to join room ${chalk.bold(room)}`);

  let socketUser;
  getUserFromSocket(socket)
    .then(user => {
      if (!user) {
        logger.debug(`no user found in socket, not joining room ${chalk.bold(room)}`);
        return false;
      }
      socketUser = user;
      return checkAccess(user);
    })
    .then(canJoin => {
      if (canJoin) {
        socket.join(room);
        logger.debug(`${chalk.bold(socketUser.name)} joined room ${chalk.bold(room)}`);
      } else {
        logger.debug(`${chalk.bold(socketUser?.name || socket.id)} is ${chalk.red('not')} allowed to join room ${chalk.bold(room)}`);
      }
    })
    .catch(err => logger.error(err));
}

io.on('connection', socket => {
  logger.debug(`Socket connected ${socket.id}`);

  socket.on('join.user', userId => {
    joinRoom(
      socket,
      userId,
      userSocketRoom,
      user => user._id === userId,
    );
  });

  // TODO make sure user has the right to leave the room (not another use trying to make another use leave a room)
  // socket.on('leave.user', userId => {
  //   socket.leave(userSocketRoom(userId));
  // });

  socket.on('join.site', siteId => {
    joinRoom(
      socket,
      siteId,
      siteSocketRoom,
      user => canAdminSite(siteId, user._id),
    );
  });

  // TODO make sure user has the right to leave the room (not another use trying to make another use leave a room)
  // socket.on('leave.site', userId => {
  //   socket.leave(siteSocketRoom(userId));
  // });

  socket.on('join.release', releaseId => {
    joinRoom(
      socket,
      releaseId,
      releaseSocketRoom,
      user => canAdminRelease(releaseId, user._id),
    );
  });

  // TODO make sure user has the right to leave the room (not another use trying to make another use leave a room)
  // socket.on('leave.release', userId => {
  //   socket.leave(siteSocketRoom(userId));
  // });

  socket.on('join.team', teamId => {
    joinRoom(
      socket,
      teamId,
      teamSocketRoom,
      user => canReadTeam(teamId, user._id),
    );
  });

  // TODO make sure user has the right to leave the room (not another use trying to make another use leave a room)
  // socket.on('leave.release', userId => {
  //   socket.leave(siteSocketRoom(userId));
  // });

  socket.on('join.org', orgId => {
    joinRoom(
      socket,
      orgId,
      orgSocketRoom,
      user => isOrgMember(user._id, orgId),
    );
  });

  // TODO make sure user has the right to leave the room (not another use trying to make another use leave a room)
  // socket.on('leave.release', userId => {
  //   socket.leave(siteSocketRoom(userId));
  // });

  // TODO org.invites
  // TODO org.members
  // TODO team.members
});
