import { genSalt, hash } from 'bcrypt';
import { env } from '../../env';
import { BranchPassword } from './branch';

export async function hashPassword(plain: string): Promise<BranchPassword> {
  return new Promise((resolve, reject) => {
    genSalt(env.MELI_BCRYPT_SALTROUNDS, (saltError, salt) => {
      if (saltError) {
        reject(saltError);
        return;
      }
      hash(plain, salt, (hashError, hashed) => {
        if (hashError) {
          reject(hashError);
        } else {
          resolve({
            hash: hashed,
            salt,
          });
        }
      });
    });
  });
}
