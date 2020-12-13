import { env } from '../../env/env';
import passport from 'passport';
import { PassportUser } from '../create-or-update-user';
import chalk from 'chalk';
import { Issuer, Strategy } from 'openid-client';
import { Logger } from '../../commons/logger/logger';
import { authMethods } from './auth-methods';

const logger = new Logger('meli.api.passport:oidc');

export const oidc_redirect = '/auth/oidc';
export const oidc_callback = '/auth/oidc/callback';

if (
  env.MELI_OIDC_DISCOVERY_URL
  && env.MELI_OIDC_CLIENT_ID
  && env.MELI_OIDC_CLIENT_SECRET
) {
  const oauthCallbackUrl = `${env.MELI_URL}${oidc_callback}`;
  logger.debug('Enabling oidc auth', oauthCallbackUrl);

  Issuer.discover(env.MELI_OIDC_DISCOVERY_URL).then(issuer => {
    const { Client } = issuer;
    const client = new Client({
      client_id: env.MELI_OIDC_CLIENT_ID,
      client_secret: env.MELI_OIDC_CLIENT_SECRET,
    });

    passport.use('oidc', new Strategy(
      {
        client,
      },
      (accessToken, refreshToken, profile, cb) => {
        cb(undefined, <PassportUser>{
          authProvider: 'oidc',
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          orgs: [],
        });
      },
    ));

    logger.info(`Enabled ${chalk.green('oidc')} auth`);
    authMethods.push('oidc');
  });
}
