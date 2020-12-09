import { env } from '../env/env';

export const authCookieName = 'auth';

export function getCookieOptions(maxAge = env.MELI_JWT_TOKEN_EXPIRATION * 1000) {
  return {
    httpOnly: true,
    path: '/',
    expires: new Date(new Date().getTime() + maxAge),
    maxAge,
    secure: env.MELI_COOKIE_SECURE,
    sameSite: env.MELI_COOKIE_SAMESITE,
  };
}

export interface JwtToken {
  userId: string;
  issuedAt: number;
}
