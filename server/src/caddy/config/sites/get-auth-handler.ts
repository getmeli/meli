import { scryptOptions } from '../../../entities/sites/hash-password';
import { base64Encode } from '../../../commons/utils/base64';
import { Password } from '../../../entities/sites/password';
import Authentication = Caddy.Http.Route.Handlers.Authentication;

export function getAuthHandler(password: Password): Authentication {
  return {
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/authentication/
    handler: 'authentication',
    providers: {
      // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/authentication/providers/http_basic/
      http_basic: {
        // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/authentication/providers/http_basic/hash/scrypt/
        hash: {
          algorithm: 'scrypt',
          N: scryptOptions.N,
          r: scryptOptions.r,
          p: scryptOptions.p,
          key_length: scryptOptions.keyLength,
        },
        hash_cache: {},
        accounts: [{
          username: 'user',
          password: Buffer.from(password.hash, 'hex').toString('base64'),
          salt: base64Encode(password.salt),
        }],
      },
    },
  };
}
