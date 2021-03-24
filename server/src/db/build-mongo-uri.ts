import { env } from '../env/env';
import { InvalidEnvironmentError } from '../commons/errors/invalid-environment-error';

// https://docs.mongodb.com/manual/reference/connection-string/
// mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
export function buildMongoUri(): string {
  if (!env.MELI_MONGO_HOST || !env.MELI_MONGO_PORT || !env.MELI_MONGO_DB) {
    throw new InvalidEnvironmentError();
  }

  return `mongodb://${
    !env.MELI_MONGO_USER ? '' : (
      `${env.MELI_MONGO_USER}${env.MELI_MONGO_PASSWORD ? `:${env.MELI_MONGO_PASSWORD}` : ''}@`
    )
  }${env.MELI_MONGO_HOST}:${env.MELI_MONGO_PORT}/${env.MELI_MONGO_DB}`;
}
