import { env } from '../../env';
import passport from 'passport';
import { Github } from './providers/github/github';
import { PassportUser } from '../create-or-update-user';
import chalk from 'chalk';
import OAuth2Strategy from 'passport-oauth2';
import { Logger } from '../../commons/logger/logger';
import { authMethods } from './auth-methods';

const logger = new Logger('meli.api.passport:github');

export const github_redirect = '/auth/github';
export const github_callback = '/auth/github/callback';

if (
  env.MELI_GITHUB_URL
  && env.MELI_GITHUB_CLIENT_ID
  && env.MELI_GITHUB_CLIENT_SECRET
) {
  const allowedOrgs = env.MELI_GITHUB_ORGS ? new Set(env.MELI_GITHUB_ORGS) : undefined;
  const oauthCallbackUrl = `${env.MELI_HOST.toString()}${github_callback}`;
  logger.debug('Enabling github auth', oauthCallbackUrl);

  passport.use('github', new OAuth2Strategy(
    {
      authorizationURL: `${env.MELI_GITHUB_URL}/login/oauth/authorize`,
      tokenURL: `${env.MELI_GITHUB_URL}/login/oauth/access_token`,
      clientID: env.MELI_GITHUB_CLIENT_ID,
      clientSecret: env.MELI_GITHUB_CLIENT_SECRET,
      callbackURL: oauthCallbackUrl,
      scope: 'read:user,user:email,read:org',
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, params, profile, cb) => {
      const github = new Github(accessToken, env.MELI_GITHUB_URL);
      github
        .getUser()
        .then(githubUser => {
          if (!allowedOrgs || githubUser.orgs.some(org => allowedOrgs.has(org))) {
            cb(undefined, <PassportUser>{
              ...githubUser,
              authProvider: 'github',
            });
          } else {
            logger.warn(`User ${githubUser.name} tried to login but is not a member of restricted orgs`);
            cb();
          }
        })
        .catch(cb);
    },
  ));

  logger.info(`Enabled ${chalk.blue('github')} auth`);
  authMethods.push('github');
}
