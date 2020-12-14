import { randomBytes, scrypt } from 'crypto';
import { Password } from './password';

export const scryptOptions = {
  saltLength: 16,
  keyLength: 64,
  N: 16384,
  r: 8,
  p: 1,
};

export async function hashPassword(plain: string): Promise<Password> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(scryptOptions.saltLength).toString('hex');

    scrypt(plain, salt, scryptOptions.keyLength, {
      N: scryptOptions.N,
      r: scryptOptions.r,
      p: scryptOptions.p,
    }, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve({
        hash: derivedKey.toString('hex'),
        salt,
      });
    });
  });
}
