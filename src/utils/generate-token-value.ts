import { randomBytes } from 'crypto';

export function generateTokenValue() {
  return randomBytes(32).toString('hex');
}
