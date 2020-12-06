import { env } from '../../env';
import passport from 'passport';
import { Logger } from '../../commons/logger/logger';
import { authMethods } from './auth-methods';
import { object, string } from 'joi';
import { PassportUser } from '../create-or-update-user';
import chalk from 'chalk';
import { Strategy } from 'passport-custom';

const logger = new Logger('meli.server.passport:in-memory');

const authId = 'in-memory';

const $form = object({
  user: string().required(),
  password: string().required(),
});

if (env.MELI_USER && env.MELI_PASSWORD) {
  logger.info(`In memory auth ${chalk.green('configured')}`);

  passport.use(authId, new Strategy(
    ((req, cb) => {
      $form
        .validateAsync(req.body)
        .then(({ user, password }) => {
          if (user === env.MELI_USER && password === env.MELI_PASSWORD) {
            cb(undefined, <PassportUser>{
              authProvider: authId,
              id: '1',
              name: env.MELI_USER,
              email: 'meli@localhost',
            });
          } else {
            cb(undefined);
          }
        })
        .catch(cb);
    }),
  ));

  authMethods.push(authId);
}
