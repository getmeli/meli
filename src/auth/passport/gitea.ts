import { env } from '../../env';
import passport from 'passport';
import { Gitea } from './providers/gitea/gitea';
import { PassportUser } from '../create-or-update-user';
import chalk from 'chalk';
import OAuth2Strategy from 'passport-oauth2';
import { Logger } from '../../commons/logger/logger';
import { authMethods } from './auth-methods';

const logger = new Logger('meli.api.passport:gitea');

export const gitea_redirect = '/auth/gitea';
export const gitea_callback = '/auth/gitea/callback';

if (
  env.MELI_GITEA_URL
  && env.MELI_GITEA_CLIENT_ID
  && env.MELI_GITEA_CLIENT_SECRET
) {
  const allowedOrgs = env.MELI_GITEA_ORGS ? new Set(env.MELI_GITEA_ORGS) : undefined;
  const oauthCallbackUrl = `${env.MELI_HOST.toString()}${gitea_callback}`;
  logger.debug('Enabling gitea auth', oauthCallbackUrl);

  passport.use('gitea', new OAuth2Strategy(
    {
      authorizationURL: `${env.MELI_GITEA_URL}/login/oauth/authorize`,
      tokenURL: `${env.MELI_GITEA_URL}/login/oauth/access_token`,
      clientID: env.MELI_GITEA_CLIENT_ID,
      clientSecret: env.MELI_GITEA_CLIENT_SECRET,
      callbackURL: oauthCallbackUrl,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, params, profile, cb) => {
      const gitea = new Gitea(accessToken, env.MELI_GITEA_URL);
      gitea
        .getUser()
        .then(giteaUser => {
          if (!allowedOrgs || giteaUser.orgs.some(org => allowedOrgs.has(org))) {
            cb(undefined, <PassportUser>{
              ...giteaUser,
              authProvider: 'gitea',
            });
          } else {
            logger.warn(`User ${giteaUser.name} tried to login but is not a member of restricted orgs`);
            cb();
          }
        })
        .catch(cb);
    },
  ));

  logger.info(`Enabled ${chalk.blue('gitea')} auth`);
  authMethods.push('gitea');
}
