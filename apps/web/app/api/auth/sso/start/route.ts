import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { buildAuthorizeUrl } from '@/lib/mcom-sso';

export const runtime = 'nodejs';

/**
 * Starts the Central Hub SSO flow. Generates a CSRF state value, stores it in
 * an httpOnly cookie and redirects the browser to Central Hub's authorize
 * endpoint.
 */
export async function GET() {
  const state = randomBytes(32).toString('hex');
  const authorizeUrl = buildAuthorizeUrl(state);

  const response = NextResponse.redirect(authorizeUrl);

  response.cookies.set('mcom_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  });

  return response;
}
