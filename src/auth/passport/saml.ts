import { env } from '../../env/env';
import passport from 'passport';
import { PassportUser } from '../create-or-update-user';
import chalk from 'chalk';
import { Strategy } from 'passport-saml';
import { Logger } from '../../commons/logger/logger';
import { authMethods } from './auth-methods';

const logger = new Logger('meli.api.passport:saml');

export const saml_redirect = '/auth/saml';
export const saml_callback = '/auth/saml/callback';

if (
  env.MELI_SAML_ENDPOINT
  && env.MELI_SAML_ISSUER
) {
  const samlCallbackUrl = `${env.MELI_URL}${saml_callback}`;
  logger.debug('Enabling saml auth', samlCallbackUrl);

  const stratOpts = {
    path: saml_callback,
    entryPoint: env.MELI_SAML_ENDPOINT,
    issuer: env.MELI_SAML_ISSUER,
    cert: null,
    privateCert: null,
    signatureAlgorithm: null,
  };

  if (
    env.MELI_SAML_IDP_CRT
    && env.MELI_SAML_PRIVATE_CRT
  ) {
    stratOpts.cert = env.MELI_SAML_IDP_CRT;
    stratOpts.privateCert = env.MELI_SAML_PRIVATE_CRT;
    stratOpts.signatureAlgorithm = 'sha256';
  } else {
    logger.warn(`You have not configured Meli to sign or validate requests. THIS IS INSECURE!
    For more information, see https://docs.meli.sh/authentication/saml`);
  }

  passport.use(new Strategy(
    stratOpts,
    (profile, cb) => {
      cb(undefined, <PassportUser>{
        authProvider: 'saml',
        id: profile.ID,
        name: profile.nameID,
        email: profile.email,
        orgs: [],
      });
    },
  ));

  logger.info(`Enabled ${chalk.green('saml')} auth`);
  authMethods.push('saml');
}
