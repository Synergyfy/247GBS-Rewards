import { NextRequest, NextResponse } from 'next/server';
import {
  createLocalSession,
  evaluateWhitelabelAccess,
  exchangeCode,
} from '@/lib/mcom-sso';
import { getPublicOrigin } from '@/lib/public-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'mcom_oauth_state';

/**
 * Central Hub SSO callback.
 *
 * 1. Verifies the CSRF state.
 * 2. Exchanges the authorization code for Central Hub tokens.
 * 3. Enforces the white-label gate (BUSINESS account + explicit grant).
 * 4. Mints a local 247GBS Rewards session and redirects to the dashboard.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = getPublicOrigin(request);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  const fail = (reason: string, status = 303) => {
    const response = NextResponse.redirect(
      new URL(`/signin?sso_error=${encodeURIComponent(reason)}`, origin),
      status,
    );
    response.cookies.delete(STATE_COOKIE);
    return response;
  };

  if (oauthError) {
    return fail('central_denied');
  }

  if (!code) {
    return fail('missing_code');
  }

  if (!state || !storedState || state !== storedState) {
    return fail('invalid_state');
  }

  let tokens;
  try {
    tokens = await exchangeCode(code);
  } catch (error) {
    console.error('Central Hub token exchange failed:', error);
    return fail('exchange_failed');
  }

  const accessToken = tokens.accessToken || tokens.access_token;
  if (!accessToken) {
    return fail('exchange_failed');
  }

  const decision = evaluateWhitelabelAccess(tokens);
  if (!decision.ok) {
    return fail(decision.reason || 'not_granted');
  }

  let session;
  try {
    session = await createLocalSession(accessToken);
  } catch (error) {
    console.error('Local SSO session creation failed:', error);
    return fail('session_failed');
  }

  const response = NextResponse.redirect(
    new URL('/loyalty-admin', origin),
    303,
  );

  // Existing app code reads this cookie from the browser and sends it as a
  // Bearer token to the backend, so it intentionally stays non-httpOnly.
  response.cookies.set('token', session.accessToken, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  // Keep the Central Hub tokens server-side for future entitlement refreshes.
  response.cookies.set('mcom_access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: tokens.expiresIn || tokens.expires_in || 3600,
  });

  const refreshToken = tokens.refreshToken || tokens.refresh_token;
  if (refreshToken) {
    response.cookies.set('mcom_refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (session.name || session.email) {
    response.cookies.set(
      'mcom_user',
      encodeURIComponent(
        JSON.stringify({
          name: session.name || '',
          email: session.email || '',
          role: session.role || '',
        }),
      ),
      {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24,
      },
    );
  }

  response.cookies.delete(STATE_COOKIE);

  return response;
}
