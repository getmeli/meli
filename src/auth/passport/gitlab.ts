import { env } from '../../env';
import passport from 'passport';
import { IncomingMessage } from 'http';
import { Gitlab } from './providers/gitlab/gitlab';
import { PassportUser } from '../create-or-update-user';
import chalk from 'chalk';
import { Logger } from '../../commons/logger/logger';
import OAuth2Strategy from 'passport-oauth2';
import { authMethods } from './auth-methods';

const logger = new Logger('meli.server.passport:gitlab');

export const gitlab_redirect = '/auth/gitlab';
export const gitlab_callback = '/auth/gitlab/callback';

const allowedGroups = new Set(env.MELI_GITLAB_GROUPS);

if (
  env.MELI_GITLAB_URL
  && env.MELI_GITLAB_CLIENT_ID
  && env.MELI_GITLAB_CLIENT_SECRET
) {
  const oauthCallbackUrl = `${env.MELI_HOST.host}${gitlab_callback}`;
  logger.debug('Enabling gitlab auth', oauthCallbackUrl);

  passport.use('gitlab', new OAuth2Strategy(
    {
      authorizationURL: `${env.MELI_GITLAB_URL}/oauth/authorize`,
      tokenURL: `${env.MELI_GITLAB_URL}/oauth/token`,
      clientID: env.MELI_GITLAB_CLIENT_ID,
      clientSecret: env.MELI_GITLAB_CLIENT_SECRET,
      callbackURL: oauthCallbackUrl,
      scope: 'read_api',
      passReqToCallback: true,
    },
    (req: IncomingMessage, accessToken, refreshToken, params, profile, cb) => {
      const gitlab = new Gitlab(accessToken, env.MELI_GITLAB_URL);
      gitlab
        .getUser()
        .then(gitlabUser => {
          if (gitlabUser.orgs.some(org => allowedGroups.has(org))) {
            cb(undefined, <PassportUser>{
              ...gitlabUser,
              authProvider: 'gitlab',
            });
          } else {
            logger.warn(`User ${gitlabUser.name} tried to login but is not a member of groups ${allowedGroups}`);
            cb();
          }
        })
        .catch(cb);
    },
  ));

  logger.info(`Enabled ${chalk.blue('gitlab')} auth`);
  authMethods.push('gitlab');
}
