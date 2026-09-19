import type { Response, CookieOptions } from 'express';

export const COOKIE_NAME = 'jwt';

export function getCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
}

export function clearAuthCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}
