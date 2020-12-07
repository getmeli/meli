import { env } from '../../env';
import passport from 'passport';
import { PassportUser } from '../create-or-update-user';
import chalk from 'chalk';
import GoogleStrategy from 'passport-google-oauth20';
import { Logger } from '../../commons/logger/logger';
import { authMethods } from './auth-methods';

const logger = new Logger('meli.api.passport:google');

export const google_redirect = '/auth/google';
export const google_callback = '/auth/google/callback';

if (
  env.MELI_GOOGLE_CLIENT_ID
  && env.MELI_GOOGLE_CLIENT_SECRET
) {
  const oauthCallbackUrl = `${env.MELI_URL}${google_callback}`;
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
        orgs: [],
      });
    },
  ));

  logger.info(`Enabled ${chalk.blue('google')} auth`);
  authMethods.push('google');
}
