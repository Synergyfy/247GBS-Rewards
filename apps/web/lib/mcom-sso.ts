/**
 * Server-only helpers for the MCOM Central Hub SSO flow.
 *
 * These functions run inside Next.js route handlers, so the client secret
 * never reaches the browser.
 */

export interface McomEntitlement {
  access?: {
    hasAccess?: boolean;
    accessType?: string;
    reason?: string;
    upgradeUrl?: string;
  };
  plan?: {
    planId?: string;
    planName?: string;
    source?: string;
    status?: string;
  } | null;
  whitelabel?: {
    enabled?: boolean;
    granted?: boolean;
    grantedAt?: string | null;
    roleEligible?: boolean;
  };
  membershipContext?: {
    isIncludedInMembership?: boolean;
  };
}

export interface McomSsoUser {
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
  profileType?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  name?: string | null;
  businessId?: string | null;
  businessName?: string | null;
}

export interface McomSsoTokenResponse {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  expiresIn?: number;
  expires_in?: number;
  tokenType?: string;
  entitlement?: McomEntitlement | null;
  user?: McomSsoUser;
}

export type WhitelabelDenialReason = 'business_only' | 'not_granted';

export interface WhitelabelDecision {
  ok: boolean;
  reason?: WhitelabelDenialReason;
}

export class McomSsoError extends Error {
  constructor(
    message: string,
    readonly code: 'exchange_failed' | 'invalid_response' = 'exchange_failed',
  ) {
    super(message);
    this.name = 'McomSsoError';
  }
}

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export function getMcomConfig() {
  return {
    solutionsUrl: stripTrailingSlash(
      process.env.MCOM_SOLUTIONS_URL || 'http://localhost:3010',
    ),
    clientId: process.env.MCOM_CLIENT_ID || '247gbs-rewards',
    clientSecret: process.env.MCOM_CLIENT_SECRET || '',
    redirectUri:
      process.env.MCOM_REDIRECT_URI || 'http://localhost:8078/auth/callback',
    scopes: process.env.MCOM_SCOPES || 'profile email business',
    appUrl: stripTrailingSlash(
      process.env.APP_URL || 'http://localhost:8078',
    ),
    whitelabelEnabled: process.env.MCOM_WHITELABEL_ENABLED === 'true',
  };
}

export function buildAuthorizeUrl(state: string): string {
  const { solutionsUrl, clientId, redirectUri, scopes } = getMcomConfig();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state,
  });

  return `${solutionsUrl}/api/v1/auth/sso/authorize?${params.toString()}`;
}

/** Exchange the authorization code for Central Hub tokens (server-side only). */
export async function exchangeCode(
  code: string,
): Promise<McomSsoTokenResponse> {
  const { solutionsUrl, clientId, clientSecret, redirectUri } = getMcomConfig();

  if (!clientSecret) {
    throw new McomSsoError('MCOM_CLIENT_SECRET is not configured');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  );

  const response = await fetch(`${solutionsUrl}/api/v1/auth/sso/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
    cache: 'no-store',
  });

  const data = (await response.json().catch(() => null)) as
    | (McomSsoTokenResponse & { message?: string })
    | null;

  if (!response.ok) {
    throw new McomSsoError(
      data?.message || `Central Hub token exchange failed (${response.status})`,
    );
  }

  if (!data) {
    throw new McomSsoError(
      'Central Hub returned an empty token response',
      'invalid_response',
    );
  }

  return data;
}

/**
 * White-label admission gate: business accounts only, with an explicit grant
 * for this platform. Membership, packages, access passes and billing are not
 * consulted for a granted business.
 */
export function evaluateWhitelabelAccess(
  payload: McomSsoTokenResponse,
): WhitelabelDecision {
  const user = payload.user;

  if (!user || user.profileType !== 'BUSINESS') {
    return { ok: false, reason: 'business_only' };
  }

  const entitlement = payload.entitlement || (user as any).entitlement;

  const granted =
    entitlement?.access?.hasAccess === true &&
    entitlement?.access?.accessType === 'WHITELABEL' &&
    entitlement?.whitelabel?.granted === true;

  return granted ? { ok: true } : { ok: false, reason: 'not_granted' };
}

/** Exchange the Central Hub token for a local 247GBS Rewards session. */
export async function createLocalSession(accessToken: string): Promise<{
  accessToken: string;
  name?: string;
  email?: string;
  role?: string;
}> {
  const apiBase = stripTrailingSlash(
    process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8079',
  );

  const response = await fetch(`${apiBase}/auth/mcom-sso`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken }),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new McomSsoError(
      data?.message || 'Unable to create a local session',
      'invalid_response',
    );
  }

  if (!data?.accessToken) {
    throw new McomSsoError(
      'Local session response did not include an access token',
      'invalid_response',
    );
  }

  return data;
}
