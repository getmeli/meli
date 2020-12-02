/* eslint-disable camelcase */

import chalk from 'chalk';
import { IncomingMessage } from 'http';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import OAuth2Strategy from 'passport-oauth2';
import { Gitea } from './providers/gitea/gitea';
import { Github } from './providers/github/github';
import { Gitlab } from './providers/gitlab/gitlab';
import { Logger } from '../commons/logger/logger';
import { env } from '../env';
import { PassportUser } from './create-or-update-user';

const logger = new Logger('meli.server:passport');

export const authMethods: string[] = [];

export const gitlab_redirect = '/auth/gitlab';
export const gitlab_callback = '/auth/gitlab/callback';

if (
  env.MELI_GITLAB_URL
  && env.MELI_GITLAB_CLIENT_ID
  && env.MELI_GITLAB_CLIENT_SECRET
) {
  const oauthCallbackUrl = `${env.MELI_HOST}${gitlab_callback}`;
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
        .getUser(profile)
        .then(gitUser => (
          cb(undefined, <PassportUser>{
            ...gitUser,
            authProvider: 'gitlab',
          })
        ))
        .catch(cb);
    },
  ));

  logger.info(`Enabled ${chalk.blue('gitlab')} auth`);
  authMethods.push('gitlab');
}

export const gitea_redirect = '/auth/gitea';
export const gitea_callback = '/auth/gitea/callback';

if (
  env.MELI_GITEA_URL
  && env.MELI_GITEA_CLIENT_ID
  && env.MELI_GITEA_CLIENT_SECRET
) {
  const oauthCallbackUrl = `${env.MELI_HOST}${gitea_callback}`;
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
        .getUser(profile)
        .then(gitUser => (
          cb(undefined, <PassportUser>{
            ...gitUser,
            authProvider: 'gitea',
          })
        ))
        .catch(cb);
    },
  ));

  logger.info(`Enabled ${chalk.blue('gitea')} auth`);
  authMethods.push('gitea');
}

export const github_redirect = '/auth/github';
export const github_callback = '/auth/github/callback';

if (
  env.MELI_GITHUB_URL
  && env.MELI_GITHUB_CLIENT_ID
  && env.MELI_GITHUB_CLIENT_SECRET
) {
  const oauthCallbackUrl = `${env.MELI_HOST}${github_callback}`;
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
        .getUser(profile)
        .then(gitUser => (
          cb(undefined, <PassportUser>{
            ...gitUser,
            authProvider: 'github',
          })
        ))
        .catch(cb);
    },
  ));

  logger.info(`Enabled ${chalk.blue('github')} auth`);
  authMethods.push('github');
}

export const google_redirect = '/auth/google';
export const google_callback = '/auth/google/callback';

if (
  env.MELI_GOOGLE_CLIENT_ID
  && env.MELI_GOOGLE_CLIENT_SECRET
) {
  const oauthCallbackUrl = `${env.MELI_HOST}${google_callback}`;
  logger.debug('Enabling google auth', oauthCallbackUrl);

  // TODO could we use the OAuth2 strategy ?
  passport.use('google', new GoogleStrategy(
    {
      clientID: env.MELI_GOOGLE_CLIENT_ID,
      clientSecret: env.MELI_GOOGLE_CLIENT_SECRET,
      callbackURL: oauthCallbackUrl,
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(undefined, <PassportUser>{
        authProvider: 'google',
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });
    },
  ));

  logger.info(`Enabled ${chalk.blue('google')} auth`);
  authMethods.push('google');
}

if (authMethods.length === 0) {
  throw new Error('No auth methods enabled, please configure one');
}
